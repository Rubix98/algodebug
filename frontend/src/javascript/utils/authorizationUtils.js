const isAdmin = (user?: User): boolean => {
    return user?.role == Role.ADMIN;
};
function isUserAuthorOfProject(user, project) {
    return project.authorId == user?._id;
}

export function canUserReadProject(user, project) {
    return project.public || isUserAuthorOfProject(user, project) || isAdmin(user);
}

export function canUserEditProject(user, project) {
    return isUserAuthorOfProject(user, project) || isAdmin(user);
}
