import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, Send, Check } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactSection() {
  const [form, setForm] = useState({ 
  name: "", 
  email: "", 
  phone: "", 
  message: "", 
  captcha: "" 
});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.captcha) {
    alert("Please complete the captcha");
    return;
  }

  setStatus("sending");

  try {
    const res = await fetch("https://lvs-backend.onrender.com/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    console.log("RESPONSE:", data);

    if (res.ok) {
      setStatus("sent");
      setTimeout(() => {
        setStatus("idle");
        setForm({ name: "", email: "", phone: "", message: "", captcha: "" });
      }, 2500);
    } else {
      console.error("ERROR BACKEND:", data);
      throw new Error("Error sending");
    }

  } catch (err) {
    console.error(err);
    setStatus("idle");
    alert("Something went wrong");
  }
};

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-card/30 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-[0.07] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                Contact
              </span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-balance">
              Let's build the <span className="text-primary">connection</span>.
            </h2>
            <p className="mt-6 text-foreground/70 leading-relaxed max-w-md">
              Planning an underground deployment or trenchless utility installation? Our team supports you from technical planning to final delivery.
            </p>

            <div className="mt-12 space-y-6">
              <a
                href="mailto:diego@lvscommunications.com"
                className="group flex items-start gap-4 hover:text-primary transition-colors"
              >
                <div className="w-11 h-11 border border-border group-hover:border-primary flex items-center justify-center shrink-0 transition-colors">
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</div>
                  <div className="font-medium">diego@lvscommunications.com</div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-border flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Coverage</div>
                  <div className="font-medium">California — statewide operations</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-border flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Availability</div>
                  <div className="font-medium">24 / 7 — For essential and time-sensitive projects.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="bg-background border border-border p-6 md:p-10 space-y-5"
          >
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2.5 text-foreground placeholder:text-muted-foreground transition-colors"
                placeholder="Your name"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2.5 transition-colors"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2.5 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                Project Details
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2.5 resize-none transition-colors"
                placeholder="Tell us about your project..."
              />
            </div>
<ReCAPTCHA
  sitekey="6LfZNNksAAAAAN3wFLY_INJbF8P6pBU6_9SNmWL1"
  onChange={(value) => setForm({ ...form, captcha: value })}
/>
            <button
              type="submit"
              disabled={status !== "idle"}
              className="group w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-semibold py-4 hover:bg-primary/90 disabled:opacity-70 transition-all"
            >
              {status === "idle" && (
                <>
                  Send Request
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
              {status === "sending" && (
                <>
                  <Send className="w-4 h-4 animate-pulse" />
                  Sending...
                </>
              )}
              {status === "sent" && (
                <>
                  <Check className="w-4 h-4" />
                  Request Sent
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
