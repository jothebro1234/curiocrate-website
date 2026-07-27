import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html, Sparkles, Environment, Text } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CH, PACKAGING_CALLOUTS, COMPONENTS, ORBIT_LABELS } from './content'

const ease = (t) => THREE.MathUtils.smoothstep(t, 0, 1)
function remap(p, [s, e]) {
  if (e === s) return p >= e ? 1 : 0
  return THREE.MathUtils.clamp((p - s) / (e - s), 0, 1)
}
const lerp = THREE.MathUtils.lerp

const TRAY_W = 3.4, TRAY_H = 1.6, TRAY_D = 2.3
const LID_H = 0.5
const REST_Y = 0.35
const RISE_Y = 2.35

function updateCamera(camera, tmp, p) {
  let pos, look
  if (p < CH.arrival2[1]) {
    const t = ease(remap(p, [CH.arrival1[0], CH.arrival2[1]]))
    pos = [0, 0.55, lerp(15, 9.4, t)]
    look = [0, 0.1, 0]
  } else if (p < CH.orbit[1]) {
    const t = remap(p, CH.orbit)
    const angle = t * Math.PI * 2.3 - Math.PI / 2
    const r = 7.1
    pos = [Math.cos(angle) * r, lerp(0.85, 1.35, t), Math.sin(angle) * r]
    look = [0, 0.1, 0]
  } else if (p < CH.spotlight[1]) {
    const t = ease(remap(p, CH.spotlight))
    const endAngle = Math.PI * 2.3 - Math.PI / 2
    const sx = Math.cos(endAngle) * 7.1, sz = Math.sin(endAngle) * 7.1
    pos = [lerp(sx, 0, t), lerp(1.35, 0.35, t), lerp(sz, 6.0, t)]
    look = [0, 0.1, 0]
  } else if (p < CH.packaging[1]) {
    const t = remap(p, CH.packaging)
    pos = [Math.sin(t * Math.PI * 1.5) * 2.3, 0.35 + t * 0.55, 5.8 - t * 0.9]
    look = [0, 0.25, 0]
  } else if (p < CH.opening[1]) {
    const t = ease(remap(p, CH.opening))
    pos = [lerp(0, 0.15, t), lerp(0.9, 4.0, t), lerp(4.9, 4.3, t)]
    look = [0, lerp(0.25, 0.5, t), 0]
  } else if (p < CH.comp3[1]) {
    const idx = p < CH.comp1[1] ? 0 : p < CH.comp2[1] ? 1 : 2
    const range = idx === 0 ? CH.comp1 : idx === 1 ? CH.comp2 : CH.comp3
    const t = ease(remap(p, range))
    const swing = Math.sin(t * Math.PI) * 1.1
    pos = [swing * (idx % 2 === 0 ? 1 : -1), 1.85, 5.4]
    look = [0, 1.75, 0]
  } else {
    const t = ease(remap(p, CH.ending))
    pos = [0, lerp(1.5, 0.7, t), lerp(4.1, 13.5, t)]
    look = [0, lerp(1.0, 0.05, t), 0]
  }
  camera.position.set(pos[0], pos[1], pos[2])
  tmp.set(look[0], look[1], look[2])
  camera.lookAt(tmp)
}

export default function Scene({ progressRef, quality = 'high' }) {
  const trayRef = useRef(null)
  const lidPivotRef = useRef(null)
  const compGroupRefs = useRef([])
  const titleRef = useRef(null)
  const particlesGroupRef = useRef(null)
  const boxGroupRef = useRef(null)
  const calloutRefs = useRef({})
  const tmpVec = useMemo(() => new THREE.Vector3(), [])
  const smoothedP = useRef(0)
  const allCallouts = useMemo(() => [
    ...PACKAGING_CALLOUTS.map((c) => ({ id: c.key, t: c.t })),
    ...COMPONENTS.flatMap((c) => c.callouts.map((cc, ci) => ({ id: `${c.key}-${ci}`, t: cc.t }))),
    ...ORBIT_LABELS.map((l, i) => ({ id: `orbit-${i}`, t: l.t })),
  ], [])

  const trayMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0c1018', metalness: 0.55, roughness: 0.38,
    clearcoat: 0.5, clearcoatRoughness: 0.25, envMapIntensity: 1.1,
  }), [])
  const lidMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#10141d', metalness: 0.6, roughness: 0.3,
    clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 1.2,
  }), [])
  const bedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#050709', metalness: 0.1, roughness: 0.9,
  }), [])

  useFrame((state, delta) => {
    smoothedP.current += (progressRef.current - smoothedP.current) * Math.min(1, delta * 6)
    const p = smoothedP.current
    updateCamera(state.camera, tmpVec, p)

    // Lid: closed until "opening" chapter, stays open through components, closes during ending
    let lidT
    if (p < CH.opening[0]) lidT = 0
    else if (p < CH.opening[1]) lidT = ease(remap(p, CH.opening))
    else if (p < CH.ending[0]) lidT = 1
    else lidT = 1 - ease(remap(p, CH.ending))
    if (lidPivotRef.current) lidPivotRef.current.rotation.x = -2.05 * lidT

    // Whole box: slow independent self-spin during orbit chapter, settles to 0 for spotlight onward
    let boxSpin = 0
    if (p >= CH.orbit[0] && p < CH.orbit[1]) {
      boxSpin = -remap(p, CH.orbit) * Math.PI * 0.6
    } else if (p >= CH.spotlight[0]) {
      boxSpin = 0
    }
    if (boxGroupRef.current) boxGroupRef.current.rotation.y = boxSpin

    // Components: rise/rotate/settle within their own chapter window, hidden otherwise
    COMPONENTS.forEach((c, i) => {
      const grp = compGroupRefs.current[i]
      if (!grp) return
      const [s, e] = CH[c.chapter]
      const t = remap(p, [s, e])
      let y = REST_Y
      let opacity = 0
      if (t > 0 && t < 1) {
        if (t < 0.35) { const rt = ease(t / 0.35); y = lerp(REST_Y, RISE_Y, rt); opacity = rt }
        else if (t < 0.72) { y = RISE_Y; opacity = 1 }
        else { const rt = ease((t - 0.72) / 0.28); y = lerp(RISE_Y, REST_Y, rt); opacity = 1 - rt }
      }
      grp.position.y = y
      grp.rotation.y = t * Math.PI * 1.4
      grp.visible = opacity > 0.01
      grp.traverse((obj) => {
        if (obj.material) { obj.material.transparent = true; obj.material.opacity = opacity }
      })
    })

    // Title text: strong on arrival, fades through orbit/spotlight, ghost-reforms at the ending
    let titleOpacity
    let titleScale = 1
    if (p < CH.orbit[0]) titleOpacity = 1
    else if (p < CH.spotlight[0]) titleOpacity = 1 - ease(remap(p, CH.orbit))
    else if (p < CH.ending[0]) titleOpacity = 0.04
    else { const t = ease(remap(p, CH.ending)); titleOpacity = 0.04 + t * 0.9; titleScale = 1 + t * 0.12 }
    if (titleRef.current) {
      titleRef.current.fillOpacity = titleOpacity
      titleRef.current.scale.setScalar(titleScale)
    }

    // Packaging + component callouts: continuous fade in/out over each anchor's own window
    allCallouts.forEach(({ id, t: [s, e] }) => {
      const el = calloutRefs.current[id]
      if (!el) return
      const mid = (s + e) / 2, half = (e - s) / 2
      const fadeT = half > 0 ? 1 - THREE.MathUtils.clamp(Math.abs(p - mid) / half, 0, 1) : (p >= s && p <= e ? 1 : 0)
      const v = p < s || p > e ? 0 : fadeT
      el.style.opacity = String(v)
      el.style.transform = `translateY(${(1 - v) * 8}px)`
    })

    // Ambient particle drift (time-based, purely decorative — doesn't affect narrative)
    if (particlesGroupRef.current) {
      particlesGroupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <>
      <Environment preset="city" background={false} environmentIntensity={0.55} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#f0f7ff" />
      <pointLight position={[-4, 1, -3]} intensity={6} color="#4d8fd6" distance={12} />
      <pointLight position={[3, -1.5, 2]} intensity={2.5} color="#a8d4f0" distance={10} />

      <group ref={particlesGroupRef}>
        <Sparkles count={quality === 'high' ? 90 : 40} scale={[10, 6, 10]} size={1.4} speed={0.15} opacity={0.35} color="#a8d4f0" />
      </group>

      <Text
        ref={titleRef}
        position={[0, 1.85, -3.6]}
        fontSize={0.95}
        letterSpacing={-0.01}
        color="#f0f7ff"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-toneMapped={false}
        fillOpacity={0}
      >
        Example Kit
      </Text>

      <group ref={boxGroupRef}>
        <RoundedBox ref={trayRef} args={[TRAY_W, TRAY_H, TRAY_D]} radius={0.1} smoothness={4} material={trayMaterial} />
        <RoundedBox args={[TRAY_W - 0.35, 0.08, TRAY_D - 0.35]} radius={0.03} smoothness={2} position={[0, TRAY_H / 2 - 0.05, 0]} material={bedMaterial} />

        <group ref={lidPivotRef} position={[0, TRAY_H / 2, -TRAY_D / 2]}>
          <RoundedBox args={[TRAY_W, LID_H, TRAY_D]} radius={0.1} smoothness={4} position={[0, LID_H / 2, TRAY_D / 2]} material={lidMaterial} />
        </group>

        {[
          [0, 0.25, TRAY_D / 2 + 0.05],
          [TRAY_W / 2 + 0.05, -0.1, 0],
          [-TRAY_W / 2 - 0.05, -0.3, 0],
        ].map((pos, i) => (
          <Html key={i} position={pos} distanceFactor={7} zIndexRange={[15, 0]} style={{ pointerEvents: 'none' }}>
            <div
              ref={(el) => (calloutRefs.current[`orbit-${i}`] = el)}
              style={{
                opacity: 0, whiteSpace: 'nowrap',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--pastel1)', textShadow: '0 0 12px rgba(168,212,240,0.6)',
              }}
            >
              {ORBIT_LABELS[i]?.label}
            </div>
          </Html>
        ))}

        {COMPONENTS.map((c, i) => (
          <group key={c.key} ref={(el) => (compGroupRefs.current[i] = el)} position={[0, REST_Y, 0]} visible={false}>
            {c.key === 'sensor' && (
              <mesh castShadow>
                <cylinderGeometry args={[0.32, 0.32, 0.5, 32]} />
                <meshPhysicalMaterial color={c.color} metalness={0.7} roughness={0.25} clearcoat={0.6} envMapIntensity={1.2} />
              </mesh>
            )}
            {c.key === 'plate' && (
              <mesh castShadow>
                <boxGeometry args={[2.2, 0.08, 1.4]} />
                <meshStandardMaterial color={c.color} metalness={0.6} roughness={0.35} />
              </mesh>
            )}
            {c.key === 'cards' && (
              <group>
                {[0, 1, 2].map((n) => (
                  <mesh key={n} position={[n * 0.03, n * 0.045, n * 0.02]} rotation={[0, 0, n * 0.03]} castShadow>
                    <boxGeometry args={[1.3, 0.04, 0.9]} />
                    <meshStandardMaterial color={c.color} metalness={0.15} roughness={0.55} />
                  </mesh>
                ))}
              </group>
            )}

            {c.callouts.map((cc, ci) => (
              <Html
                key={ci}
                position={[cc.side === 'left' ? -1.1 : 1.1, 0.2, 0]}
                distanceFactor={7}
                zIndexRange={[20, 0]}
                style={{ pointerEvents: 'none' }}
              >
                <div ref={(el) => (calloutRefs.current[`${c.key}-${ci}`] = el)} style={{ opacity: 0 }}>
                  <HudCallout title={cc.title} desc={cc.desc} side={cc.side} />
                </div>
              </Html>
            ))}
          </group>
        ))}
      </group>

      {PACKAGING_CALLOUTS.map((c) => (
        <Html key={c.key} position={c.position} distanceFactor={7} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div ref={(el) => (calloutRefs.current[c.key] = el)} style={{ opacity: 0 }}>
            <HudCallout title={c.title} desc={c.desc} side={c.position[0] < 0 ? 'left' : 'right'} />
          </div>
        </Html>
      ))}

      {quality === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
          <DepthOfField focusDistance={0.015} focalLength={0.045} bokehScale={2.2} />
          <Vignette eskil={false} offset={0.28} darkness={0.65} />
        </EffectComposer>
      )}
    </>
  )
}

function HudCallout({ title, desc, side = 'right' }) {
  return (
    <div
      style={{
        width: 190,
        fontFamily: "'JetBrains Mono', monospace",
        textAlign: side === 'left' ? 'right' : 'left',
        transform: side === 'left' ? 'translateX(-100%)' : 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: side === 'left' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a8d4f0', boxShadow: '0 0 10px rgba(168,212,240,0.9)', flexShrink: 0 }} />
        <div style={{ flex: 1, height: 1, background: side === 'left' ? 'linear-gradient(to left, #a8d4f0, transparent)' : 'linear-gradient(to right, #a8d4f0, transparent)' }} />
      </div>
      <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--cream)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 10.5, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--muted)', lineHeight: 1.55 }}>{desc}</div>
    </div>
  )
}
