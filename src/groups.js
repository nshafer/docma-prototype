

export function createNGroups(students, num_groups) {
    num_groups = Math.min(num_groups, students.length);

    const groups = [];

    // Create the empty groups data structure
    for (let i = 0; i < num_groups; i++) {
        groups.push({
            number: i + 1,
            students: []
        });
    }

    // Put students into the groups
    for (let i = 0; i < students.length; i++) {
        groups[i % num_groups].students.push(students[i]);
    }

    return groups;
}

export function createGroupsWithN(students, num_per_group) {
    num_per_group = Math.min(num_per_group, students.length);
    const num_groups = Math.ceil(students.length / num_per_group);
    return createNGroups(students, num_groups);
}
