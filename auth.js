const login = document.querySelector('.email');
const password = document.querySelector('.pass');
const authBtn = document.querySelector('.authbtn');

function checkUser(e) {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    let foundUser = null;

    for (let i = 0; i < storedUsers.length; i++) {
        if (
            login.value.trim().toLowerCase() === storedUsers[i].login.toLowerCase() &&
            password.value.trim() === storedUsers[i].pass
        ) {
            foundUser = storedUsers[i];
            break;
        }
    }

    if (foundUser) {
        console.log('Пользователь найден:', foundUser);
        alert('Вход выполнен успешно');
        localStorage.setItem('currentUser', JSON.stringify(foundUser)); // Сохраняем текущего пользователя
        window.location = "profile.html";
    } else {
        alert('Неверный логин или пароль');
    }
}

authBtn.addEventListener('click', checkUser);