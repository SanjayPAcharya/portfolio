import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';

export default function CM() {
  const [step, setStep] = useState(0);
  const [hasSentRead, setHasSentRead] = useState(false);
  const maxStep = 4;
  const { post } = useApi();

  const handleTap = () => {
    setStep(prev => (prev < maxStep ? prev + 1 : prev));
  };

  const badgeText =
    step === 0 ? 'Touch me' : step < maxStep ? 'Touch me again' : 'Thank you';

  useEffect(() => {
    if (step !== maxStep || hasSentRead) return;

    setHasSentRead(true);

    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const trackingData = {
      page: 'cm-secret',
      readAt: new Date().toISOString(),
      device: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      },
    };

    const payload = {
      name: 'Read',
      email: 'read@sanjaykumarp.info',
      phone: '0000000000',
      description: JSON.stringify(trackingData),
    };

    void post('contacts', payload).catch(() => {
      // Ignore errors for this silent tracking call
    });
  }, [step, hasSentRead, post, maxStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 sm:p-10 overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-sky-500/10 via-fuchsia-500/10 to-indigo-500/10 blur-3xl" />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xs uppercase tracking-[0.3em] text-sky-300/80 mb-4 text-center sm:text-left"
          >
            For you, and only you
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6 text-center sm:text-left"
          >
            I&apos;m really, truly sorry.
          </motion.h1>

          <div className="space-y-4 text-sm sm:text-base text-slate-100/90 leading-relaxed">
            {step >= 1 && (
              <motion.p
                key="p1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                I&apos;ve been replaying our conversation and the way I said the thing that hurt
                you. I know my words landed in a way that you didn&apos;t deserve, and I&apos;m so
                sorry for the pain I caused.
              </motion.p>
            )}
            {step >= 2 && (
              <motion.p
                key="p2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                No one has ever really asked me questions like that before, and I didn&apos;t know
                how to answer in a thoughtful way. I said what I said from the perspective of past
                things that happened, and expectations that some people had from me. I wasn&apos;t able to express myself properly.
              </motion.p>
            )}
            {step >= 3 && (
              <motion.p
                key="p3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                I can&apos;t take back what I said, but I can take responsibility for it. I want to
                do better and listen more carefully, speak more gently, and try my best to make sure
                i won't hurt you again.
              </motion.p>
            )}
            {step >= 4 && (
              <motion.p
                key="p4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                Not at all defending myself, but to understand and find a way to heal this together.
                Take your time, and let me know when you are ready to put this behind us.
              </motion.p>
            )}
          </div>
          <button
            type="button"
            onClick={handleTap}
            className="mt-6 flex justify-center w-full focus:outline-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
              whileTap={{ scale: 0.92, rotate: -3 }}
              whileHover={{ scale: 1.03 }}
              className="relative"
            >
              <motion.img
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDNoaTcyM3JxaXduN2M0N21sY3RpNG1yNm9qZnZybnNqeDBzNHZoeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MDJ9IbxxvDUQM/giphy.gif"
                alt="Cute apology bear"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-white/20 shadow-lg object-cover bg-slate-900/60 cursor-pointer"
              />
              <motion.div
                key={badgeText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[10px] uppercase tracking-[0.25em] text-sky-200/90"
              >
                {badgeText}
              </motion.div>
            </motion.div>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.9, duration: 0.6 }}
            className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="text-xs sm:text-sm text-slate-200/80">
              <p>This little secret page is just for you.</p>
            </div>
            <div className="text-right sm:text-left">
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
