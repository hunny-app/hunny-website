(function initWaitlistForm() {
  const form = document.getElementById("waitlistForm");
  if (!form) {
    return;
  }

  const emailInput = document.getElementById("waitlistEmail");
  const nameInput = document.getElementById("waitlistName");
  const hpInput = document.getElementById("waitlistHp");
  const submitBtn = document.getElementById("waitlistSubmit");
  const statusEl = document.getElementById("waitlistStatus");

  if (hpInput) {
    hpInput.value = "";
  }

  function setStatus(message, isError) {
    if (!statusEl) {
      return;
    }
    statusEl.textContent = message;
    statusEl.classList.toggle("waitlist-status--error", Boolean(isError));
    statusEl.hidden = !message;
  }

  function isValidEmail(value) {
    const v = value.trim();
    if (!v || v.length > 254) {
      return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    const cfg = window.HUNNY_WAITLIST || {};
    const url = (cfg.supabaseUrl || "").replace(/\/$/, "");
    const key = cfg.supabaseAnonKey || "";

    if (!url || !key) {
      setStatus(
        "Waitlist is not connected yet. Add your Supabase URL and anon key in waitlist-config.js.",
        true
      );
      return;
    }

    if (hpInput && hpInput.value) {
      setStatus("Thanks — you’re on the list.", false);
      form.reset();
      return;
    }

    const email = emailInput ? emailInput.value : "";
    const name = nameInput ? nameInput.value : "";

    if (!isValidEmail(email)) {
      setStatus("Please enter a valid email address.", true);
      if (emailInput) {
        emailInput.focus();
      }
      return;
    }

    const payload = {
      email: email.trim().toLowerCase(),
      name: name.trim() ? name.trim() : null,
    };

    if (submitBtn) {
      submitBtn.disabled = true;
    }
    setStatus("Sending…", false);

    try {
      const res = await fetch(`${url}/rest/v1/waitlist_signups`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("You’re on the list. We’ll be in touch.", false);
        form.reset();
        return;
      }

      if (res.status === 409) {
        setStatus("You’re already on the waitlist — thank you!", false);
        return;
      }

      const text = await res.text().catch(() => "");
      setStatus(
        text
          ? "Something went wrong. Please try again or email us."
          : "Something went wrong. Please try again.",
        true
      );
    } catch {
      setStatus("Network error. Check your connection and try again.", true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
})();
