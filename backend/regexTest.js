const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const password = "Sk@#1112";
console.log('Test result:', passwordRegex.test(password));
