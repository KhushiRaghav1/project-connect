document.addEventListener('DOMContentLoaded', () => {

    // --- Data and State Simulation ---
    const state = {
        userId: 'user-' + Math.random().toString(36).substr(2, 9),
        userProfile: {
            name: '',
            skills: [],
            interests: [],
            experience: '',
            academicField: 'Any',
            yearOfStudy: 'Any',
            projects: [],
        },
        projects: [],
    };

    const OPTIONS = {
        ACADEMIC_FIELD: ['Any', 'B.Tech', 'B.Sc', 'B.Com', 'B.A.', 'M.Tech', 'M.Sc', 'M.A.', 'Ph.D.', 'Other'],
        YEAR_OF_STUDY: ['Any', '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduated'],
        PROJECT_STATUS: ['Open for Collaboration', 'In Progress', 'Completed', 'On Hold'],
    };

    // --- UI Element Selectors ---
    const pages = document.querySelectorAll('.page');
    const navItems = document.querySelectorAll('.nav-item');
    const projectsList = document.getElementById('projects-list');
    const noProjectsMessage = document.getElementById('no-projects-message');
    const myProjectsList = document.getElementById('my-projects-list');
    const noMyProjectsMessage = document.getElementById('no-my-projects-message');
    const userIdElement = document.getElementById('user-id');
    const footerUserIdElement = document.getElementById('footer-user-id');
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const modalActions = document.getElementById('modal-actions');
    const editProjectModal = document.getElementById('edit-project-modal');
    
    // Forms
    const createProjectForm = document.getElementById('create-project-form');
    const profileForm = document.getElementById('profile-form');
    const findTeamForm = document.getElementById('find-team-form');
    const editProjectForm = document.getElementById('edit-project-form');

    // --- Helper Functions ---
    const navigateTo = (pageId) => {
        pages.forEach(page => page.classList.add('hidden'));
        document.getElementById(`${pageId}-page`).classList.remove('hidden');
        navItems.forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    };

    const showModal = (message, isConfirm = false) => {
        modalMessage.innerHTML = message;
        modalActions.innerHTML = '';
        if (isConfirm) {
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'modal-btn bg-red-600 text-white hover:bg-red-700';
            confirmBtn.textContent = 'Delete';
            confirmBtn.onclick = () => resolveModal(true);
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'modal-btn border border-gray-300 text-gray-700 hover:bg-gray-100 mr-2';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => resolveModal(false);
            modalActions.appendChild(cancelBtn);
            modalActions.appendChild(confirmBtn);
        } else {
            const okBtn = document.createElement('button');
            okBtn.id = 'modal-ok-btn';
            okBtn.className = 'modal-btn bg-blue-600 text-white hover:bg-blue-700';
            okBtn.textContent = 'OK';
            okBtn.onclick = () => closeModal();
            modalActions.appendChild(okBtn);
        }
        modal.classList.remove('hidden');
        return new Promise(resolve => {
            window.resolveModal = resolve;
        });
    };

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    const generateProjectId = () => {
        return 'proj-' + Math.random().toString(36).substr(2, 9);
    };

    const renderProjects = () => {
        if (state.projects.length === 0) {
            projectsList.classList.add('hidden');
            noProjectsMessage.classList.remove('hidden');
        } else {
            projectsList.innerHTML = '';
            projectsList.classList.remove('hidden');
            noProjectsMessage.classList.add('hidden');
            state.projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${project.name}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-3">${project.description}</p>
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><path d="M16 21V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14"/><line x1="12" y1="12" x2="12" y2="12"/></svg>
                        <span>Domain: ${project.subjectDomain || 'N/A'}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <span>Team: ${project.isTeamProject ? 'Team Project' : 'Solo'}</span>
                    </div>
                    ${project.requiredSkills.length > 0 ? `
                        <div class="mb-3">
                            <span class="text-sm font-semibold text-gray-700">Skills Needed:</span>
                            <div class="flex flex-wrap gap-2 mt-1">
                                ${project.requiredSkills.map(skill => `<span class="tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Req. Field: ${project.requiredAcademicField}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Req. Year: ${project.requiredYearOfStudy}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M12 2c-.93 0-1.78.3-2.5.85a4 4 0 0 0 2.5 7.15c.93 0 1.78-.3 2.5-.85a4 4 0 0 0-2.5-7.15z"/><path d="M12 12c-1.1 0-2 .9-2 2v3h4v-3c0-1.1-.9-2-2-2z"/></svg>
                        <span>Status: ${project.status}</span>
                    </div>
                    <button class="btn w-full bg-blue-500 text-white hover:bg-blue-600 mt-2 contact-btn">Contact</button>
                `;
                card.querySelector('.contact-btn').onclick = () => showModal(`To contact the owner of "${project.name}", a real-time messaging system would be implemented.`);
                projectsList.appendChild(card);
            });
        }
    };

    const renderMyProjects = () => {
        const myProjects = state.projects.filter(p => p.ownerId === state.userId);
        if (myProjects.length === 0) {
            myProjectsList.classList.add('hidden');
            noMyProjectsMessage.classList.remove('hidden');
        } else {
            myProjectsList.innerHTML = '';
            myProjectsList.classList.remove('hidden');
            noMyProjectsMessage.classList.add('hidden');
            myProjects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = 'border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center';
                projectItem.innerHTML = `
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800">${project.name}</h4>
                        <p class="text-sm text-gray-600">Status: ${project.status}</p>
                    </div>
                    <div class="flex space-x-2 mt-3 sm:mt-0">
                        <button data-id="${project.id}" class="icon-btn bg-yellow-500 text-white hover:bg-yellow-600 edit-project-btn" title="Edit Project">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button data-id="${project.id}" data-name="${project.name}" class="icon-btn bg-red-500 text-white hover:bg-red-600 delete-project-btn" title="Delete Project">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                    </div>
                `;
                myProjectsList.appendChild(projectItem);
            });
            document.querySelectorAll('.edit-project-btn').forEach(button => {
                button.addEventListener('click', (e) => handleEditProject(e.currentTarget.dataset.id));
            });
            document.querySelectorAll('.delete-project-btn').forEach(button => {
                button.addEventListener('click', (e) => handleDeleteProject(e.currentTarget.dataset.id, e.currentTarget.dataset.name));
            });
        }
    };

    const populateSelects = () => {
        const selectAcademicField = document.getElementById('requiredAcademicField');
        const selectYearOfStudy = document.getElementById('requiredYearOfStudy');
        const selectProfileAcademicField = document.getElementById('academicField');
        const selectProfileYearOfStudy = document.getElementById('yearOfStudy');
        const selectProjectStatus = document.getElementById('projectStatus');
        const selectTargetAcademicField = document.getElementById('target-academic-field');
        const selectTargetYearOfStudy = document.getElementById('target-year-of-study');
        const editAcademicField = document.getElementById('editRequiredAcademicField');
        const editYearOfStudy = document.getElementById('editRequiredYearOfStudy');
        const editProjectStatus = document.getElementById('editProjectStatus');

        [selectAcademicField, selectProfileAcademicField, selectTargetAcademicField, editAcademicField].forEach(select => {
            select.innerHTML = OPTIONS.ACADEMIC_FIELD.map(field => `<option value="${field}">${field}</option>`).join('');
        });
        [selectYearOfStudy, selectProfileYearOfStudy, selectTargetYearOfStudy, editYearOfStudy].forEach(select => {
            select.innerHTML = OPTIONS.YEAR_OF_STUDY.map(year => `<option value="${year}">${year}</option>`).join('');
        });
        [selectProjectStatus, editProjectStatus].forEach(select => {
            select.innerHTML = OPTIONS.PROJECT_STATUS.map(status => `<option value="${status}">${status}</option>`).join('');
        });
    };

    const renderProfile = () => {
        document.getElementById('profileName').value = state.userProfile.name;
        document.getElementById('profileSkills').value = state.userProfile.skills.join(', ');
        document.getElementById('profileInterests').value = state.userProfile.interests.join(', ');
        document.getElementById('profileExperience').value = state.userProfile.experience;
        document.getElementById('academicField').value = state.userProfile.academicField;
        document.getElementById('yearOfStudy').value = state.userProfile.yearOfStudy;
        renderMyProjects();
    };

    // --- Event Handlers ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.currentTarget.dataset.page;
            navigateTo(pageId);
            if (pageId === 'projects') {
                renderProjects();
            } else if (pageId === 'profile') {
                renderProfile();
            }
        });
    });

    document.getElementById('home-create-project').addEventListener('click', () => navigateTo('create-project'));
    document.getElementById('home-find-team').addEventListener('click', () => navigateTo('find-team'));
    document.getElementById('home-explore-projects').addEventListener('click', () => {
        navigateTo('projects');
        renderProjects();
    });
    document.getElementById('create-first-project-btn').addEventListener('click', () => navigateTo('create-project'));

    createProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProject = {
            id: generateProjectId(),
            name: document.getElementById('projectName').value,
            description: document.getElementById('description').value,
            subjectDomain: document.getElementById('subjectDomain').value,
            requiredSkills: document.getElementById('requiredSkills').value.split(',').map(s => s.trim()).filter(s => s),
            requiredAcademicField: document.getElementById('requiredAcademicField').value,
            requiredYearOfStudy: document.getElementById('requiredYearOfStudy').value,
            status: document.getElementById('projectStatus').value,
            isTeamProject: document.getElementById('isTeamProject').checked,
            ownerId: state.userId,
            createdAt: new Date().toISOString(),
        };
        state.projects.push(newProject);
        state.userProfile.projects.push(newProject.id);
        showModal('Project created successfully!');
        createProjectForm.reset();
        navigateTo('projects');
        renderProjects();
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.userProfile.name = document.getElementById('profileName').value;
        state.userProfile.skills = document.getElementById('profileSkills').value.split(',').map(s => s.trim()).filter(s => s);
        state.userProfile.interests = document.getElementById('profileInterests').value.split(',').map(s => s.trim()).filter(s => s);
        state.userProfile.experience = document.getElementById('profileExperience').value;
        state.userProfile.academicField = document.getElementById('academicField').value;
        state.userProfile.yearOfStudy = document.getElementById('yearOfStudy').value;
        showModal('Profile updated successfully!');
        renderMyProjects();
    });

    const handleEditProject = (projectId) => {
        const project = state.projects.find(p => p.id === projectId);
        if (!project) return;
        document.getElementById('edit-project-id').value = project.id;
        document.getElementById('editProjectName').value = project.name;
        document.getElementById('editDescription').value = project.description;
        document.getElementById('editSubjectDomain').value = project.subjectDomain;
        document.getElementById('editRequiredSkills').value = project.requiredSkills.join(', ');
        document.getElementById('editRequiredAcademicField').value = project.requiredAcademicField;
        document.getElementById('editRequiredYearOfStudy').value = project.requiredYearOfStudy;
        document.getElementById('editProjectStatus').value = project.status;
        document.getElementById('editIsTeamProject').checked = project.isTeamProject;
        editProjectModal.classList.remove('hidden');
    };

    editProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectId = document.getElementById('edit-project-id').value;
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            project.name = document.getElementById('editProjectName').value;
            project.description = document.getElementById('editDescription').value;
            project.subjectDomain = document.getElementById('editSubjectDomain').value;
            project.requiredSkills = document.getElementById('editRequiredSkills').value.split(',').map(s => s.trim()).filter(s => s);
            project.requiredAcademicField = document.getElementById('editRequiredAcademicField').value;
            project.requiredYearOfStudy = document.getElementById('editRequiredYearOfStudy').value;
            project.status = document.getElementById('editProjectStatus').value;
            project.isTeamProject = document.getElementById('editIsTeamProject').checked;
            showModal('Project updated successfully!');
            editProjectModal.classList.add('hidden');
            renderMyProjects();
        }
    });

    document.getElementById('edit-modal-cancel').addEventListener('click', () => {
        editProjectModal.classList.add('hidden');
    });

    const handleDeleteProject = async (projectId, projectName) => {
        const confirmed = await showModal(`
            <p>Are you sure you want to delete the project "${projectName}"?</p>
            <p class="font-bold text-red-500">This action cannot be undone.</p>
        `, true);
        if (confirmed) {
            state.projects = state.projects.filter(p => p.id !== projectId);
            state.userProfile.projects = state.userProfile.projects.filter(id => id !== projectId);
            showModal(`Project "${projectName}" deleted successfully!`);
            renderMyProjects();
        }
    };

    findTeamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchQuery = document.getElementById('search-query').value.toLowerCase();
        const academicField = document.getElementById('target-academic-field').value;
        const yearOfStudy = document.getElementById('target-year-of-study').value;

        // Simplified, filtered search for projects and dummy users
        const searchResults = state.projects.filter(p => {
            const matchesSearch = searchQuery === '' ||
                p.name.toLowerCase().includes(searchQuery) ||
                p.description.toLowerCase().includes(searchQuery) ||
                p.requiredSkills.some(skill => skill.toLowerCase().includes(searchQuery));
            const matchesField = academicField === 'Any' || p.requiredAcademicField === academicField;
            const matchesYear = yearOfStudy === 'Any' || p.requiredYearOfStudy === yearOfStudy;
            return matchesSearch && matchesField && matchesYear;
        });

        // Add some dummy user matches for demonstration
        const dummyUsers = [
            { name: 'Alice Johnson', skills: ['Graphic Design', 'Figma'], academicField: 'B.A.', yearOfStudy: '2nd Year', description: 'UI/UX Designer looking for a creative team.' },
            { name: 'Bob Williams', skills: ['Python', 'Machine Learning'], academicField: 'M.Sc', yearOfStudy: 'Graduated', description: 'AI/ML enthusiast seeking a data science project.' },
            { name: 'Charlie Green', skills: ['Environmental Science', 'Policy Analysis'], academicField: 'B.Sc', yearOfStudy: '1st Year', description: 'Passionate about climate change and sustainability.' },
        ];
        const userResults = dummyUsers.filter(u => {
            const matchesSearch = searchQuery === '' ||
                u.name.toLowerCase().includes(searchQuery) ||
                u.description.toLowerCase().includes(searchQuery) ||
                u.skills.some(skill => skill.toLowerCase().includes(searchQuery));
            const matchesField = academicField === 'Any' || u.academicField === academicField;
            const matchesYear = yearOfStudy === 'Any' || u.yearOfStudy === yearOfStudy;
            return matchesSearch && matchesField && matchesYear;
        });

        const matchingResultsContainer = document.getElementById('matching-results-container');
        matchingResultsContainer.innerHTML = '';
        if (searchResults.length === 0 && userResults.length === 0) {
            document.getElementById('no-matches-message').classList.remove('hidden');
            return;
        }
        document.getElementById('no-matches-message').classList.add('hidden');

        [...searchResults, ...userResults].forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.className = 'card border border-purple-200 p-6 mb-4';
            resultCard.innerHTML = `
                <div class="flex items-center mb-2">
                    <h4 class="text-xl font-semibold text-gray-800">${result.name}</h4>
                </div>
                <p class="text-gray-600 text-sm mb-3">${result.description}</p>
                ${result.skills ? `
                    <div class="mb-3">
                        <span class="text-sm font-semibold text-gray-700">Skills:</span>
                        <div class="flex flex-wrap gap-2 mt-1">
                            ${result.skills.map(skill => `<span class="tag green">${skill}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                <button class="btn w-full bg-purple-500 text-white hover:bg-purple-600 mt-3 contact-btn">Contact</button>
            `;
            resultCard.querySelector('.contact-btn').onclick = () => showModal(`To contact ${result.name}, a real-time messaging system would be implemented.`);
            matchingResultsContainer.appendChild(resultCard);
        });
    });

    // --- Initial Setup ---
    userIdElement.textContent = state.userId;
    footerUserIdElement.textContent = state.userId;
    populateSelects();
    navigateTo('home');
});