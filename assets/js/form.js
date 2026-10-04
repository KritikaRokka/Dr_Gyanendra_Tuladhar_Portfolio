/* form.js: contact form validation and submit states.
   States: empty (hints only), invalid (inline errors), loading, error (retry), success.
   Hooks: [data-form], [data-field], [data-error], [data-form-status], [data-form-submit],
          [data-form-success], [data-form-reset].
   Set data-endpoint on the form to post to a real URL. Without it, the form runs in demo mode. */
(function () {
  "use strict";

  var form = document.querySelector("[data-form]");
  if (!form) {
    return;
  }

  var status = form.querySelector("[data-form-status]");
  var submit = form.querySelector("[data-form-submit]");
  var submitLabel = submit.querySelector("[data-submit-label]");
  var success = document.querySelector("[data-form-success]");
  var resetButton = document.querySelector("[data-form-reset]");
  var endpoint = form.getAttribute("data-endpoint") || "";
  var idleLabel = submitLabel.textContent;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var messages = {
    name: { required: "Enter your name." },
    email: {
      required: "Enter your email address.",
      format: "Enter an email address like name@example.com."
    },
    message: {
      required: "Write a message.",
      short: "Write at least 20 characters so I know what you need."
    }
  };

  function fieldOf(input) {
    return input.closest("[data-field]");
  }

  function problem(input) {
    var value = input.value.trim();
    var key = input.name;
    if (!input.required) {
      return "";
    }
    if (!value) {
      return messages[key].required;
    }
    if (key === "email" && !EMAIL.test(value)) {
      return messages.email.format;
    }
    if (key === "message" && value.length < 20) {
      return messages.message.short;
    }
    return "";
  }

  function paint(input) {
    var text = problem(input);
    var field = fieldOf(input);
    var slot = field.querySelector("[data-error]");
    slot.textContent = text;
    field.classList.toggle("has-error", Boolean(text));
    if (text) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
    return text;
  }

  function showStatus(kind, text) {
    status.hidden = false;
    status.className = "form__status form__status--" + kind;
    status.textContent = text;
  }

  function clearStatus() {
    status.hidden = true;
    status.textContent = "";
  }

  function setLoading(state) {
    form.classList.toggle("is-loading", state);
    submit.disabled = state;
    submit.setAttribute("aria-disabled", String(state));
    submitLabel.textContent = state ? "Sending" : idleLabel;
  }

  function finish() {
    setLoading(false);
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  function fail() {
    setLoading(false);
    showStatus("error", "The message did not send. Check your connection and try again, or use the email address on this page.");
  }

  var inputs = Array.prototype.slice.call(form.querySelectorAll("[data-field] input, [data-field] textarea"));

  inputs.forEach(function (input) {
    input.addEventListener("blur", function () {
      if (input.value || fieldOf(input).classList.contains("has-error")) {
        paint(input);
      }
    });
    input.addEventListener("input", function () {
      if (fieldOf(input).classList.contains("has-error")) {
        paint(input);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    var invalid = inputs.filter(function (input) {
      return paint(input);
    });

    if (invalid.length) {
      showStatus("error", invalid.length === 1 ? "One field needs a change." : invalid.length + " fields need a change.");
      invalid[0].focus();
      return;
    }

    var trap = form.querySelector("[name='website']");
    if (trap && trap.value) {
      finish();
      return;
    }

    setLoading(true);

    if (!endpoint) {
      window.setTimeout(finish, 900);
      return;
    }

    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = window.setTimeout(function () {
      if (controller) {
        controller.abort();
      }
    }, 15000);

    fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
      signal: controller ? controller.signal : undefined
    })
      .then(function (response) {
        window.clearTimeout(timer);
        if (response.ok) {
          finish();
        } else {
          fail();
        }
      })
      .catch(function () {
        window.clearTimeout(timer);
        fail();
      });
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      form.reset();
      inputs.forEach(function (input) {
        fieldOf(input).classList.remove("has-error");
        fieldOf(input).querySelector("[data-error]").textContent = "";
        input.removeAttribute("aria-invalid");
      });
      clearStatus();
      success.hidden = true;
      form.hidden = false;
      inputs[0].focus();
    });
  }
})();
