import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useLanguage } from '../i18n/useLanguage'

// CurioCrate Creator Program (Kit Research Internship) — a dedicated light-mode
// editorial page, deliberately not the dark cinematic-glass look used elsewhere
// on the site. See CinematicNavbar.jsx / CinematicFooter.jsx / ParticleField.jsx
// for the matching light-theme switch on this route (LIGHT_ROUTE_PREFIX).
const INK   = '#0B1B33'
const CRATE = '#1B7FE8'
const SPARK = '#3FC8F5'
const SKY   = '#E8F2FD'
const PAPER = '#FFFFFF'

const APPLY_URL = 'https://forms.gle/1pE8a4CNeE9a1jW17'
const CONTACT_EMAIL = 'contact@curiocrate.org'

const mono = "'JetBrains Mono', monospace"
const serif = "'Cormorant Garamond', serif"
const sans = "'Plus Jakarta Sans', sans-serif"

function Mono({ children, color = 'inherit', style }) {
  return (
    <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color, ...style }}>
      {children}
    </span>
  )
}

// Cohort 01 submissions deadline — live countdown, same pattern as the STEM
// Advocacy Project's StemCountdown in KitDevelopment.jsx.
const COHORT1_DEADLINE = new Date('2026-09-26T23:59:00-08:00')

function useCountdown(target) {
  const [msLeft, setMsLeft] = useState(() => target.getTime() - Date.now())
  useEffect(() => {
    const id = setInterval(() => setMsLeft(target.getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  return Math.max(msLeft, 0)
}

function CreatorCountdown() {
  const { t } = useLanguage()
  const msLeft = useCountdown(COHORT1_DEADLINE)
  const closed = msLeft <= 0

  const days = Math.floor(msLeft / 86400000)
  const hours = Math.floor((msLeft % 86400000) / 3600000)
  const minutes = Math.floor((msLeft % 3600000) / 60000)
  const seconds = Math.floor((msLeft % 60000) / 1000)
  const pad = n => String(n).padStart(2, '0')

  const units = [
    [days, t('creatorProgram.countdown.days', 'Days')],
    [hours, t('creatorProgram.countdown.hours', 'Hrs')],
    [minutes, t('creatorProgram.countdown.minutes', 'Min')],
    [seconds, t('creatorProgram.countdown.seconds', 'Sec')],
  ]

  return (
    <div className="cp-countdown" style={{
      display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap',
      padding: '16px 22px',
      border: `1px solid ${CRATE}`,
      borderRadius: 6,
      background: 'rgba(63,200,245,0.08)',
      marginBottom: 30,
    }}>
      <Mono color="rgba(255,255,255,0.6)">
        {closed
          ? t('creatorProgram.countdown.closed', 'Cohort 01 submissions are closed')
          : t('creatorProgram.countdown.label', 'Cohort 01 Submissions Close In')}
      </Mono>
      {!closed && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          {units.map(([value, label], i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'baseline' }}>
              <div style={{ textAlign: 'center', minWidth: 40 }}>
                <div style={{
                  fontFamily: mono, fontSize: 24, fontWeight: 700, lineHeight: 1,
                  color: SPARK, textShadow: '0 0 18px rgba(63,200,245,0.4)',
                }}>{pad(value)}</div>
                <div style={{
                  fontFamily: mono, fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)', marginTop: 3,
                }}>{label}</div>
              </div>
              {i < units.length - 1 && (
                <div style={{
                  fontFamily: mono, fontSize: 22, fontWeight: 700, color: SPARK,
                  opacity: 0.5, alignSelf: 'flex-start', margin: '0 6px',
                }}>:</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SPEC_ROWS = [
  ['grades', 'GRADES', '9–12'],
  ['cohortSize', 'COHORT SIZE', '2–3 students'],
  ['kitBudget', 'KIT BUDGET', 'Up to $1,000'],
  ['admissions', 'ADMISSIONS', 'Cohort 01 · Closes Sep 26'],
  ['credit', 'CREDIT', 'Your name on the box'],
]

const DELIVERABLES = [
  {
    key: 'prototype', num: '01', bg: CRATE,
    title: 'The Prototype',
    body: 'A working version of your kit, built with a $20 materials budget and tested on actual kids. Rough is fine. Untested is not.',
    bullets: ['Under $20 in materials', 'Runs in one 45-minute class period', 'Tested on real students', 'Cardboard and hot glue encouraged'],
  },
  {
    key: 'kit', num: '02', bg: INK,
    title: 'The Kit',
    body: "The produced version: materials, instructions, and a teacher's guide, manufactured and shipped. We fund the run and pay vendors directly.",
    bullets: ['Full instruction card', "Teacher's guide included", 'Up to $1,000 production funding', 'Your name printed on the packaging'],
  },
]

const TIMELINE = [
  { num: '01', tag: 'CONCEPT', title: 'Pick your concept', body: 'Choose what you want to teach and defend why it belongs in a box. Not every concept survives this step.' },
  { num: '02', tag: 'BUILD', title: 'Build the prototype', body: 'Spend the materials budget, build it badly, test it on kids, and find out what you got wrong.' },
  { num: '03', tag: 'REVIEW', title: 'Expert review', body: "A professor or industry professional in your kit's field reviews your prototype and tells you what a fourth-grader will misunderstand. You rebuild." },
  { num: '04', tag: 'LAUNCH', title: 'Produced & shipped', body: 'We fund the production run. Your kit ships to our partner chapters and classrooms, with your name on the packaging and documented volunteer hours in your file.' },
]

const WHAT_YOU_GET = [
  {
    key: 'credit', num: '01', title: 'Curio Crate Creator Credit',
    body: 'Your name stays attached to the kit and its materials — a real product you developed, shown on the main website and printed on the kit packaging. You are now a certified CurioCrate Creator.',
  },
  {
    key: 'hours', num: '02', title: 'Documented Volunteer Hours',
    body: 'Verifiable service hours for school, scholarship, and service requirements — logged and signed off by CurioCrate leadership.',
  },
  {
    key: 'connections', num: '03', title: 'Guaranteed Professor & Professional Connections',
    body: "We introduce your kit, and you, to university professors and subject-matter experts in your kit's field of science who've partnered with CurioCrate to review your work and give feedback.",
  },
  {
    key: 'funding', num: '04', title: 'We Fund Everything',
    body: "You don't pay to build your idea. CurioCrate provides the funds for your prototype (up to $20), and up to $1,000 worth of production for your kit.",
  },
  {
    key: 'mentorship', num: '05', title: 'Real Mentorship',
    body: "One-on-one guidance from CurioCrate's Product Leadership team through every stage of turning an idea into a shipped product.",
  },
  {
    key: 'impact', num: '06', title: 'Serving An Underserved Area',
    body: 'Your kit is put to work as a teaching aid for student education in underserved communities — a real product doing real good, not a shelved school project.',
  },
]

const FAQ = [
  { q: 'Is this paid?', a: "No. The $1,000 is your kit's production budget, paid to vendors. No stipend, no out-of-pocket cost to you." },
  { q: 'Time commitment?', a: 'Flexible, paced to your build and your school schedule. Expect a few hours most weeks.' },
  { q: 'How are hours verified?', a: 'Logged and signed off by the CurioCrate product team at each milestone.' },
  { q: 'What if my kit gets cut?', a: "Some concepts don't survive concept review. If yours doesn't, you'll know why, and you're welcome to pitch again next cohort." },
  { q: 'Who runs CurioCrate?', a: 'CurioCrate is a student-founded 501(c)(3) nonprofit — the Creator Program is run directly by our product and curriculum team.' },
]

export default function CreatorProgram() {
  const { t } = useLanguage()

  return (
    <PageTransition>
      <div style={{ background: PAPER }}>

        {/* ─── HERO — ink block ─── */}
        <section style={{ background: INK, padding: '148px 40px 72px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 56, alignItems: 'start' }} className="cp-hero-grid">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Mono color="rgba(255,255,255,0.5)">{t('creatorProgram.hero.eyebrow', 'CURIO CRATE KIT DEVELOPMENT PROGRAM INTERNSHIP · COHORT 01')}</Mono>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05 }}
                style={{
                  fontFamily: serif, fontWeight: 300,
                  fontSize: 'clamp(44px, 6.5vw, 84px)', lineHeight: 1.02,
                  letterSpacing: '-0.03em', color: PAPER, margin: '16px 0 22px',
                }}
              >
                {t('creatorProgram.hero.headline', 'Creator Program')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{ fontSize: 20, fontWeight: 700, color: PAPER, lineHeight: 1.5, maxWidth: 560, margin: '0 0 18px' }}
              >
                {t('creatorProgram.hero.lead', 'Do you build things, and want one of them shipped to real classrooms?')}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 580, margin: '0 0 34px' }}
              >
                {t('creatorProgram.hero.bodyIntro', 'If so, look no further. Mentored by')}{' '}
                <strong style={{ color: PAPER }}>{t('creatorProgram.hero.bodyMentors', 'professors and working professionals')}</strong>
                {t('creatorProgram.hero.bodyMid', ', this is a selective internship for students in grades 9–12, built around one question:')}{' '}
                <em style={{ color: SPARK, fontStyle: 'italic' }}>{t('creatorProgram.hero.bodyQuestion', 'how do you teach a big idea to a ten-year-old in 45 minutes?')}</em>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.17 }}
              >
                <CreatorCountdown />
              </motion.div>

              <motion.a
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                href={APPLY_URL} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontFamily: mono, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
                  fontWeight: 700, textDecoration: 'none',
                  background: SPARK, color: INK,
                  padding: '14px 30px', borderRadius: 4,
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)' }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
              >
                {t('creatorProgram.hero.apply', 'APPLY HERE')}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </motion.a>
            </div>

            {/* Spec table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              style={{ border: `1px solid ${CRATE}`, borderRadius: 4, overflow: 'hidden' }}
            >
              {SPEC_ROWS.map(([key, label, value], i) => (
                <div key={key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '18px 20px',
                  borderTop: i === 0 ? 'none' : `1px solid ${CRATE}`,
                }}>
                  <Mono color="rgba(255,255,255,0.55)">{t(`creatorProgram.hero.spec.${key}Label`, label)}</Mono>
                  <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, color: PAPER, textAlign: 'right' }}>
                    {t(`creatorProgram.hero.spec.${key}Value`, value)}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── WHAT YOU BUILD ─── */}
        <section style={{ padding: '96px 40px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: serif, fontWeight: 300, fontSize: 'clamp(28px, 3.4vw, 42px)',
                color: INK, margin: '0 0 28px',
                borderBottom: `3px solid ${CRATE}`, paddingBottom: 14, display: 'inline-block',
              }}
            >
              {t('creatorProgram.whatYouBuild.label', 'What You Build')}
            </motion.h2>

            <div className="cp-deliverables" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {DELIVERABLES.map((d, i) => (
                <motion.div
                  key={d.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  style={{ background: d.bg, color: PAPER, padding: '32px 30px 34px', minHeight: 300, display: 'flex', flexDirection: 'column' }}
                >
                  <Mono color="rgba(255,255,255,0.6)" style={{ marginBottom: 18 }}>
                    {t(`creatorProgram.whatYouBuild.${d.key}.tag`, `DELIVERABLE ${d.num}`)}
                  </Mono>
                  <h3 style={{ fontFamily: serif, fontWeight: 300, fontSize: 30, color: PAPER, margin: '0 0 14px' }}>
                    {t(`creatorProgram.whatYouBuild.${d.key}.title`, d.title)}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', margin: '0 0 24px', maxWidth: 420 }}>
                    {t(`creatorProgram.whatYouBuild.${d.key}.body`, d.body)}
                  </p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {d.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontFamily: mono, fontSize: 12, letterSpacing: '0.5px', color: 'rgba(255,255,255,0.75)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>■</span>
                        {t(`creatorProgram.whatYouBuild.${d.key}.bullets.${bi}`, b)}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BANNER LINE ─── */}
        <section style={{ padding: '40px 40px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', border: `1px solid ${SKY}`, padding: '34px 30px', textAlign: 'center' }}>
            <p style={{ fontFamily: serif, fontWeight: 300, fontSize: 'clamp(22px, 3vw, 32px)', color: INK, margin: 0 }}>
              {t('creatorProgram.bannerLine.pre', 'This is not just a resume line. Creators leave with a shipped product, a funded prototype, a professor in their corner, and documented hours —')}{' '}
              <em style={{ color: CRATE, fontStyle: 'italic' }}>{t('creatorProgram.bannerLine.emphasis', 'all before they graduate.')}</em>
            </p>
          </div>
        </section>

        {/* ─── HOW IT RUNS ─── */}
        <section style={{ padding: '56px 40px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: serif, fontWeight: 300, fontSize: 'clamp(28px, 3.4vw, 42px)',
                color: INK, margin: '0 0 28px',
                borderBottom: `3px solid ${CRATE}`, paddingBottom: 14, display: 'inline-block',
              }}
            >
              {t('creatorProgram.howItRuns.label', 'How It Runs')}
            </motion.h2>

            <div className="cp-timeline" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: `1px solid ${SKY}` }}>
              {TIMELINE.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  style={{ padding: '26px 22px', borderLeft: i === 0 ? 'none' : `1px solid ${SKY}` }}
                >
                  <div style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 34, color: CRATE, lineHeight: 1, marginBottom: 10 }}>
                    {step.num}
                  </div>
                  <Mono color="rgba(11,27,51,0.4)" style={{ display: 'block', marginBottom: 10 }}>
                    {t(`creatorProgram.howItRuns.steps.${i}.tag`, step.tag)}
                  </Mono>
                  <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 20, color: INK, margin: '0 0 10px' }}>
                    {t(`creatorProgram.howItRuns.steps.${i}.title`, step.title)}
                  </h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(11,27,51,0.65)', margin: 0 }}>
                    {t(`creatorProgram.howItRuns.steps.${i}.body`, step.body)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHAT YOU GET ─── */}
        <section style={{ padding: '80px 40px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: serif, fontWeight: 300, fontSize: 'clamp(28px, 3.4vw, 42px)',
                color: INK, margin: '0 0 28px',
                borderBottom: `3px solid ${CRATE}`, paddingBottom: 14, display: 'inline-block',
              }}
            >
              {t('creatorProgram.whatYouGet.label', 'What You Get')}
            </motion.h2>

            <div className="cp-getgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {WHAT_YOU_GET.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  style={{ border: `1px solid ${SKY}`, padding: '28px 24px 30px', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: CRATE, lineHeight: 1, marginBottom: 14 }}>
                    {item.num}
                  </div>
                  <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 19, color: INK, margin: '0 0 10px', lineHeight: 1.3 }}>
                    {t(`creatorProgram.whatYouGet.${item.key}.title`, item.title)}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(11,27,51,0.68)', margin: 0 }}>
                    {t(`creatorProgram.whatYouGet.${item.key}.body`, item.body)}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 17, color: 'rgba(11,27,51,0.6)', textAlign: 'center', margin: '32px 0 0' }}
            >
              {t('creatorProgram.whatYouGet.more', "...and more — priority consideration for future cohorts, a written reference from CurioCrate leadership, and a seat on the team building what's next.")}
            </motion.p>
          </div>
        </section>

        {/* ─── WHO WE TAKE ─── */}
        <section style={{ padding: '90px 40px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Mono color={CRATE} style={{ display: 'block', marginBottom: 16 }}>
                {t('creatorProgram.whoWeTake.label', 'Who We Take')}
              </Mono>
              <p style={{ fontFamily: serif, fontWeight: 300, fontSize: 'clamp(22px, 2.8vw, 30px)', color: INK, lineHeight: 1.4, margin: '0 0 22px' }}>
                {t('creatorProgram.whoWeTake.leadPre', 'We look for students who')}{' '}
                <em style={{ color: CRATE, fontStyle: 'italic' }}>{t('creatorProgram.whoWeTake.leadEmphasis', 'finish things.')}</em>{' '}
                {t('creatorProgram.whoWeTake.leadRest', "A robot, a lesson plan, a zine, an app nobody used — scale doesn't matter, finishing does.")}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(11,27,51,0.65)', margin: '0 0 14px' }}>
                {t('creatorProgram.whoWeTake.body2', "Two things we can't teach: you're fine being told your idea doesn't work yet, and you'd rather test something on a real kid than argue about it in a doc.")}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(11,27,51,0.65)', margin: 0 }}>
                {t('creatorProgram.whoWeTake.body3', 'No research experience, science-fair record, or GPA cutoff required.')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section style={{ padding: '90px 40px 100px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: serif, fontWeight: 300, fontSize: 'clamp(28px, 3.4vw, 42px)',
                color: INK, margin: '0 0 28px',
                borderBottom: `3px solid ${CRATE}`, paddingBottom: 14, display: 'inline-block',
              }}
            >
              {t('creatorProgram.faq.label', 'FAQ')}
            </motion.h2>

            <div>
              {FAQ.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  style={{ padding: '20px 0', borderTop: `1px solid ${SKY}` }}
                >
                  <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 15, color: INK, marginBottom: 8 }}>
                    {t(`creatorProgram.faq.items.${i}.q`, item.q)}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(11,27,51,0.65)' }}>
                    {t(`creatorProgram.faq.items.${i}.a`, item.a)}
                  </div>
                </motion.div>
              ))}
              <div style={{ borderTop: `1px solid ${SKY}` }} />
            </div>
          </div>
        </section>

        {/* ─── CLOSING BANNER — crate block ─── */}
        <section style={{ background: CRATE, padding: '84px 40px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}
          >
            <h2 style={{ fontFamily: serif, fontWeight: 300, fontSize: 'clamp(32px, 4.5vw, 52px)', color: PAPER, margin: '0 0 18px' }}>
              {t('creatorProgram.closing.heading', 'Cohort 01 is open')}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, margin: '0 0 32px' }}>
              {t('creatorProgram.closing.line', 'Grades 9–12. Cohorts of 2 to 3. Up to $1,000 to build it, and a real classroom at the end. Cohort 01 submissions close September 26, 11:59 PM.')}
            </p>
            <a
              href={APPLY_URL} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: mono, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
                fontWeight: 700, textDecoration: 'none',
                background: PAPER, color: INK,
                padding: '15px 34px', borderRadius: 4,
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.96)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
            >
              {t('creatorProgram.closing.button', 'APPLY NOW')}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
            <div style={{ marginTop: 22 }}>
              <Mono color="rgba(255,255,255,0.75)">
                {t('creatorProgram.closing.under', 'Rolling review · 2–3 seats · Questions:')} {CONTACT_EMAIL}
              </Mono>
            </div>
          </motion.div>
        </section>

      </div>

      <style>{`
        @media(max-width: 900px){
          .cp-hero-grid { grid-template-columns: 1fr !important; }
          .cp-deliverables { grid-template-columns: 1fr !important; }
          .cp-timeline { grid-template-columns: 1fr 1fr !important; }
          .cp-timeline > div:nth-child(3) { border-left: none !important; }
          .cp-getgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width: 560px){
          .cp-timeline { grid-template-columns: 1fr !important; }
          .cp-timeline > div { border-left: none !important; border-top: 1px solid ${SKY}; }
          .cp-timeline > div:first-child { border-top: none; }
          .cp-getgrid { grid-template-columns: 1fr !important; }
          .cp-countdown { padding: 12px 16px !important; gap: 12px !important; }
        }
      `}</style>
    </PageTransition>
  )
}
