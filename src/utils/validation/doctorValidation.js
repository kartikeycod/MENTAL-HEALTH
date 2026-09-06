export const validateEmail = (email) => {
  if (!email) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(String(email).toLowerCase())) {
    return "Please enter a valid email address.";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
};

export const validateDoctorForm = (form) => {
  const errors = {};

  // Account validation
  const emailErr = validateEmail(form.email);
  if (emailErr) errors.email = emailErr;

  const passErr = validatePassword(form.password);
  if (passErr) errors.password = passErr;

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  // Professional information validation
  if (!form.fullName || !form.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!form.degree || !form.degree.trim()) {
    errors.degree = "Degree/Qualification is required.";
  }

  if (!form.specialization || !form.specialization.trim()) {
    errors.specialization = "Specialization is required.";
  }

  if (form.experienceYears === "" || form.experienceYears === undefined || form.experienceYears === null) {
    errors.experienceYears = "Years of experience is required.";
  } else if (isNaN(Number(form.experienceYears)) || Number(form.experienceYears) < 0) {
    errors.experienceYears = "Experience must be a non-negative number.";
  }

  if (!form.bio || form.bio.trim().length < 20) {
    errors.bio = "Please provide a detailed bio (at least 20 characters).";
  }

  if (!form.languages || form.languages.length === 0) {
    errors.languages = "Please select at least one language.";
  }

  // Verification metadata validation (Must upload/select documents)
  if (!form.documents || form.documents.length === 0) {
    errors.documents = "Please select your qualification/license verification documents.";
  }

  // Initial plan validation (at least one plan)
  if (!form.plans || form.plans.length === 0) {
    errors.plans = "Please add at least one consultation plan.";
  } else {
    form.plans.forEach((plan, idx) => {
      if (!plan.name || !plan.name.trim()) {
        errors[`plan_${idx}_name`] = "Plan name is required.";
      }
      if (isNaN(Number(plan.price)) || Number(plan.price) <= 0) {
        errors[`plan_${idx}_price`] = "Plan price must be greater than 0.";
      }
      if (!plan.duration || !plan.duration.trim()) {
        errors[`plan_${idx}_duration`] = "Plan duration is required.";
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateReviewForm = ({ rating, comment }) => {
  const errors = {};
  if (!rating || rating < 1 || rating > 5) {
    errors.rating = "Please select a rating between 1 and 5 stars.";
  }
  if (!comment || comment.trim().length < 5) {
    errors.comment = "Please write a comment of at least 5 characters.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
