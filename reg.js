const loginUser = document.querySelector('.login');
const passWord = document.querySelector('.pass');
const nameUser = document.querySelector('.name');
const registerBtn = document.querySelector('.btn');

let registerUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
let userIdCounter = JSON.parse(localStorage.getItem('userIdCounter')) || 0;

function registerUserLs(e) {
    e.preventDefault();
    const existingUser = registerUsers.find(user => user.login === loginUser.value);
    if (existingUser) {
        alert('Этот логин уже занят. Пожалуйста, выберите другой.');
        return;
    }

    if (loginUser.value.trim() && nameUser.value.trim() && passWord.value.trim()) {
        userIdCounter++;
        const user = {
            id: userIdCounter,
            name: nameUser.value,
            login: loginUser.value,
            pass: passWord.value
        };
        registerUsers.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(registerUsers));
        localStorage.setItem('userIdCounter', JSON.stringify(userIdCounter));
        window.location = "auth.html";
    } else {
        alert('Пожалуйста, заполните все поля');
    }
}

registerBtn.addEventListener('click', registerUserLs);