function isUserAuthorOfProject(user, project) {
    return project.authorId == user?._id;
}

export function canUserReadProject(user, project) {
    return isUserAuthorOfProject(user, project) || project.public;
}

export function canUserEditProject(user, project) {
    return isUserAuthorOfProject(user, project);
}
