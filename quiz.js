(function initValidationQuiz() {
  const steps = Array.from(document.querySelectorAll(".quiz-step"));
  const progressBlock = document.getElementById("quizProgressBlock");
  const progressEl = document.getElementById("quizProgress");
  const progressBar = document.getElementById("quizProgressBar");
  const progressFill = document.getElementById("quizProgressFill");
  const insightList = document.getElementById("quizInsightList");
  const insightOutro = document.getElementById("quizInsightOutro");
  const primaryCta = document.getElementById("quizPrimaryCta");
  const restartWrap = document.getElementById("quizRestartWrap");
  const restartBtn = document.getElementById("quizRestart");
  const prevBtn = document.getElementById("quizPrev");
  const footerNav = document.getElementById("quizFooterNav");

  if (!steps.length) {
    return;
  }

  const ANSWER_ORDER = [
    "who",
    "distance",
    "checkin",
    "trust",
    "silence",
    "noresponse",
    "guilt",
    "peak",
    "desire",
  ];

  const ANSWER_TOTAL = ANSWER_ORDER.length;
  const CHECKPOINT_TOTAL = 10;
  const LAST_ANSWER_STEP_INDEX = 10;
  const RESULT_STEP_INDEX = 11;

  const answers = {};
  let index = 0;

  function clearAnswersFromLandingStep(stepIndex) {
    if (stepIndex <= 0) {
      return;
    }
    let startQ;
    if (stepIndex === 1) {
      startQ = 1;
    } else if (stepIndex === 2) {
      startQ = 2;
    } else if (stepIndex === LAST_ANSWER_STEP_INDEX) {
      startQ = ANSWER_TOTAL;
    } else {
      startQ = stepIndex;
    }
    for (let q = startQ; q <= ANSWER_TOTAL; q++) {
      const key = ANSWER_ORDER[q - 1];
      if (key) {
        delete answers[key];
      }
    }
  }

  function clearAllAnswers() {
    ANSWER_ORDER.forEach((k) => delete answers[k]);
  }

  function completedCountForStep(stepIndex) {
    if (stepIndex === 1) {
      return 0;
    }
    if (stepIndex === 2) {
      return 1;
    }
    if (stepIndex >= 3 && stepIndex <= LAST_ANSWER_STEP_INDEX) {
      return stepIndex - 2;
    }
    if (stepIndex >= RESULT_STEP_INDEX) {
      return ANSWER_TOTAL;
    }
    return 0;
  }

  function setProgressUI(stepIndex) {
    if (!progressBlock || !progressEl) {
      return;
    }

    if (stepIndex >= 1 && stepIndex <= LAST_ANSWER_STEP_INDEX) {
      progressBlock.hidden = false;
      const label =
        stepIndex === 2
          ? `Step ${stepIndex} of ${CHECKPOINT_TOTAL}`
          : `Question ${stepIndex === 1 ? 1 : stepIndex - 1} of ${CHECKPOINT_TOTAL}`;
      progressEl.textContent = label;
      const done = completedCountForStep(stepIndex);
      const pct = Math.round((done / ANSWER_TOTAL) * 100);
      if (progressFill) {
        progressFill.style.width = `${pct}%`;
      }
      if (progressBar) {
        progressBar.setAttribute("aria-valuenow", String(pct));
        progressBar.setAttribute(
          "aria-valuetext",
          `${done} of ${ANSWER_TOTAL} questions answered`
        );
      }
      return;
    }

    if (stepIndex >= RESULT_STEP_INDEX) {
      progressBlock.hidden = false;
      progressEl.textContent = "Complete";
      if (progressFill) {
        progressFill.style.width = "100%";
      }
      if (progressBar) {
        progressBar.setAttribute("aria-valuenow", "100");
        progressBar.setAttribute("aria-valuetext", "All questions answered");
      }
      return;
    }

    progressBlock.hidden = true;
    progressEl.textContent = "";
    if (progressFill) {
      progressFill.style.width = "0%";
    }
    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", "0");
      progressBar.setAttribute("aria-valuetext", "Not started");
    }
  }

  function applySelectedState(stepIndex) {
    const step = steps[stepIndex];
    if (!step) {
      return;
    }
    step.querySelectorAll(".quiz-option[data-answer]").forEach((btn) => {
      const key = btn.getAttribute("data-answer");
      const value = btn.getAttribute("data-value");
      const on = key && value && answers[key] === value;
      btn.classList.toggle("is-selected", Boolean(on));
    });
  }

  function showStep(i) {
    index = i;
    steps.forEach((el, j) => {
      const active = j === i;
      el.classList.toggle("is-active", active);
      el.hidden = !active;
    });

    setProgressUI(i);

    if (i >= 1 && i <= LAST_ANSWER_STEP_INDEX) {
      applySelectedState(i);
    }

    if (restartWrap) {
      restartWrap.hidden = i <= 0;
    }

    if (prevBtn) {
      prevBtn.hidden = i <= 0;
    }

    if (footerNav) {
      footerNav.hidden = i <= 0;
    }

    const card = document.querySelector("[data-quiz-card]");
    if (card) {
      const h = steps[i] && steps[i].querySelector("h1, h2");
      if (h && typeof h.id === "string" && h.id) {
        card.setAttribute("aria-labelledby", h.id);
      }
    }

    const step = steps[i];
    const selected = step && step.querySelector(".quiz-option.is-selected");
    const focusTarget =
      selected ||
      (step && step.querySelector("button[data-next], .quiz-option, button, a[href]"));
    if (focusTarget && typeof focusTarget.focus === "function") {
      focusTarget.focus({ preventScroll: true });
    }
  }

  function bulletForCheckin(v) {
    switch (v) {
      case "calls":
        return "them answering when you call";
      case "texts":
        return "them replying to your messages";
      case "group":
        return "scraps of signal from group chats";
      case "none":
        return "remembering to reach out in the first place";
      default:
        return "them replying";
    }
  }

  function bulletForTrust(v) {
    switch (v) {
      case "yes":
        return 'taking "I\'m fine" at face value';
      case "mostly":
        return "them being honest most of the time";
      case "not_really":
      case "unsure":
        return "them being honest when they say they're fine";
      default:
        return "them being honest";
    }
  }

  function bulletForGuilt(v) {
    switch (v) {
      case "yes":
      case "sometimes":
        return "you remembering to check — and still wondering if it’s enough";
      default:
        return "you remembering to check";
    }
  }

  function ctaLabelForPeak(v) {
    if (v === "emergency" || v === "late") {
      return "Sounds Good!";
    }
    return "Sounds Good!";
  }

  function renderResult() {
    if (!insightList || !insightOutro) {
      return;
    }

    const b1 = bulletForCheckin(answers.checkin);
    const b2 = bulletForTrust(answers.trust);
    const b3 = bulletForGuilt(answers.guilt);

    insightList.innerHTML = "";
    [b1, b2, b3].forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      insightList.appendChild(li);
    });

    insightOutro.textContent =
      "That means you could miss when something actually changes.";

    if (primaryCta) {
      primaryCta.textContent = ctaLabelForPeak(answers.peak);
    }
  }

  function goNext() {
    if (index < steps.length - 1) {
      showStep(index + 1);
    }
  }

  function goBack() {
    if (index <= 0) {
      return;
    }
    const target = index - 1;
    if (target === 0) {
      clearAllAnswers();
    } else if (target >= 1) {
      clearAnswersFromLandingStep(target);
    }
    showStep(target);
  }

  document.getElementById("quizSteps")?.addEventListener("click", (e) => {
    const nextBtn = e.target.closest("[data-next]");
    if (nextBtn) {
      goNext();
      return;
    }

    const opt = e.target.closest(".quiz-option[data-answer]");
    if (!opt) {
      return;
    }

    const key = opt.getAttribute("data-answer");
    const value = opt.getAttribute("data-value");
    if (key && value) {
      answers[key] = value;
    }

    if (index === LAST_ANSWER_STEP_INDEX) {
      renderResult();
    }

    goNext();
  });

  prevBtn?.addEventListener("click", () => {
    goBack();
  });

  restartBtn?.addEventListener("click", () => {
    clearAllAnswers();
    showStep(0);
  });

  showStep(0);
})();
