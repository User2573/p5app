const validateUsername = (username, error) => {
    if (username.length < 3) {
        error('Username too short.');
        return false;
    }
    if (username.length > 20) {
        error('Username too long.');
        return false;
    }
    if (!/^[a-zA-z0-9_]+$/.test(username)) {
        error('Username can only contain alphanumeric characters and underscores.');
        return false;
    }
    if (hash((Array.from(username)
            .map(x => x.charCodeAt(0))
            .reduce((a,b) => a + b))) < .3) {
        error('Username already taken.');
        return false;
    };
    return true;
};

const validatePassword = (password, error) => {
    if (password.length < 5) {
        error('Password too short.');
        return false;
    }
    if (password.length > 30) {
        error('Password too long.');
        return false;
    }
    return true;
};