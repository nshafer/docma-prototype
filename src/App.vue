<template>
    <div id="app">
        <header class="d-flex">
            <div class="title">DOCMA Prototype</div>

            <nav class="mb-3 flex-grow-1">
                <div class="nav nav-tabs" id="main-menu" role="tablist">
                    <a id="nav-tab-students" class="nav-item nav-link" data-toggle="tab" href="#nav-students">Students</a>
                    <a id="nav-tab-groupmaker" class="nav-item nav-link" data-toggle="tab" href="#nav-groupmaker">Group Maker</a>
                </div>
            </nav>
        </header>

        <div class="tab-content" id="nav-tabContent">
            <!-- Students -->
            <div id="nav-students" class="tab-pane">
                <div class="mb-4">
                    <div v-if="Object.keys(classlist).length <= 0" class="empty">No classes found</div>
                    <div v-for="cls in classlist" :key="cls.id" class="cls card mb-3">
                        <div class="card-body">
                            <div class="card-title d-flex justify-content-between">
                                <h5>{{ cls.name }}</h5>
                                <div class="cls__actions">
                                    <button class="cls__import btn btn-secondary btn-sm ml-2"
                                            @click="showImportStudents(cls)">
                                        <i class="fas fa-file-import"></i>
                                        Import
                                    </button>
                                    <button class="cls__delete btn btn-danger btn-sm ml-2" @click="deleteClass(cls)">
                                        <i class="fas fa-trash"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div class="card-text">
                                <div class="student-list">
                                    <div v-for="student in cls.students" :key="student.id" class="student-list__item">
                                        {{ student.name }}
                                        <button class="student-list__delete" @click="deleteStudent(cls, student)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                    <div class="student-list__addstudent">
                                        <div class="input-group">
                                            <input class="form-control -addstudent" :id="'add-student-' + cls.id" type="text" placeholder="Add student"
                                                   @keyup.enter="addStudent(cls, 'add-student-' + cls.id)"/>
                                            <div class="input-group-append">
                                                <button class="btn btn-primary" type="button" @click="addStudent(cls, 'add-student-' + cls.id)">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="input-group mb-4">
                    <input class="form-control" type="text" placeholder="Add class"
                           v-model="newclass" @keyup.enter="addClass"/>
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" @click="addClass">Add</button>
                    </div>
                </div>

                <div class="buttons">
                    <button class="btn btn-secondary" data-toggle="modal" data-target="#backup-modal">
                        Backup
                    </button>
                    <button class="btn btn-secondary" data-toggle="modal" data-target="#restore-modal">
                        Restore
                    </button>
                </div>
            </div>

            <!-- Group Maker -->
            <div id="nav-groupmaker" class="tab-pane">
                <div class="groupmaker form-inline mb-3">
                    <div class="form-group mr-2 groupmaker__class">
                        <select class="form-control" v-model="group_cls">
                            <!--<option value="" disabled>Select Class</option>-->
                            <option v-for="cls in classlist" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
                        </select>
                    </div>

                    <div class="form-group mr-2 groupmaker__num">
                        <input class="groupmaker__numinput form-control" type="number" placeholder="#" min="0"
                               v-model="group_num">
                    </div>

                    <div class="btn-group btn-group-toggle mr-2">
                        <label class="btn btn-outline-secondary" :class="{ 'active': group_type=== 'num' }">
                            <input type="radio" value="num" v-model="group_type">
                            groups
                        </label>
                        <label class="btn btn-outline-secondary" :class="{ 'active': group_type=== 'per' }">
                            <input type="radio" value="per" v-model="group_type">
                            per group
                        </label>
                    </div>

                    <button class="btn btn-primary" :class="{ 'disabled': !group_cls || !group_num }"
                            @click="shuffleGroups">
                        Shuffle Groups
                    </button>
                </div>

                <div class="groups row">
                    <div v-for="group in groups" :key="group.number" class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                        <div class="card mb-4">
                            <div class="card-header">
                                <strong>
                                    Group {{ group.number }}
                                </strong>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li v-for="student in group.students" :key="student.id" class="list-group-item">
                                    {{ student.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Import modal -->
        <div class="modal fade" id="import-students-modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Import Students for {{ importing_cls.name }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Paste the list of students below. It should be one line per student, no commas, no spaces</p>
                        <textarea v-model="import_list" class="form-control" rows="10">
                        </textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="importStudents">Import</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Backup modal -->
        <div class="modal fade" id="backup-modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Backup Data</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Copy the data below to backup.</p>
                        <textarea v-model="backup_data" class="form-control" rows="10">
                        </textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Restore modal -->
        <div class="modal fade" id="restore-modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Restore Data</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Paste in your backup data to restore.</p>
                        <textarea v-model="restore_data" class="form-control" rows="10">
                        </textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="restoreData">Restore Data</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {generateUniqueId, b64EncodeUnicode, b64DecodeUnicode, shuffle} from "./util";
    import {createGroupsWithN, createNGroups} from "./groups";

    export default {
        name: 'app',
        data () {
            return {
                newclass: '',
                importing_cls: '',
                import_list: '',
                restore_data: '',
                classlist: [],

                groups: [],
                group_cls: '',
                group_num: '',
                group_type: 'num',
            }
        },

        methods: {
            addClass() {
                this.classlist.push({
                    id: generateUniqueId(),
                    name: this.newclass,
                    students: []
                });
                this.newclass = '';
            },

            deleteClass(cls) {
                this.classlist = this.classlist.filter(c => c.id !== cls.id);
            },

            addStudentToClass(cls, name) {
                let student = cls.students.find(student => student.name.toLowerCase() === name.toLowerCase());
                if (!student) {
                    student = {
                        id: generateUniqueId(),
                        name: name,
                        active: true
                    };
                    cls.students.push(student);
                }
                return student;
            },

            addStudent(cls, target) {
                const element = document.getElementById(target);
                const name = element.value;
                this.addStudentToClass(cls, name);
                element.value = '';
            },

            deleteStudent(cls, student) {
                cls.students = cls.students.filter(s => s.id !== student.id);
            },

            showImportStudents(cls) {
                this.import_list = '';
                this.importing_cls = cls;
                $("#import-students-modal").modal('show');
            },

            importStudents() {
                const lines = this.import_list.split('\n');
                for (let line of lines) {
                    let student = line.trim();
                    this.addStudentToClass(this.importing_cls, student);
                }
                $("#import-students-modal").modal('hide');
            },

            restoreData() {
                this.classlist = JSON.parse(b64DecodeUnicode(this.restore_data));
                $("#restore-modal").modal('hide');
            },

            shuffleGroups() {
                const students = this.classlist_hash[this.group_cls].students.slice();
                shuffle(students);
                if (this.group_type === "num") {
                    this.groups = createNGroups(students, this.group_num);
                } else if (this.group_type === "per") {
                    this.groups = createGroupsWithN(students, this.group_num);
                }
            },
        },

        computed: {
            classlist_hash () {
                const hash = {};
                for (let cls of this.classlist) {
                    hash[cls.id] = cls;
                }
                return hash;
            },

            backup_data () {
                return b64EncodeUnicode(JSON.stringify(this.classlist));
            },
        },

        watch: {
            classlist: {
                handler(val) {
                    localStorage.setItem('classlist', JSON.stringify(val));
                },
                deep: true,
            },
            group_cls (val) {
                localStorage.setItem('group_cls', val);
            },
            group_num (val) {
                localStorage.setItem('group_num', val);
            },
            group_type (val) {
                localStorage.setItem('group_type', val);
            },
        },

        mounted () {
            if (localStorage.getItem('classlist')) {
                this.classlist = JSON.parse(localStorage.getItem('classlist'));
            }
            if (localStorage.getItem('group_cls')) {
                this.group_cls = localStorage.getItem('group_cls');
            }
            if (localStorage.getItem('group_num')) {
                this.group_num = localStorage.getItem('group_num');
            }
            if (localStorage.getItem('group_type')) {
                this.group_type = localStorage.getItem('group_type');
            }
            $('#nav-tab-students').tab('show');
        },
    }
</script>

<style>
    @import url("./styles/base.css");

    #app {
        padding: 1em;
    }

    .title {
        color: #333;
        padding: .5em 2em .5em 0;
    }

    .student-list {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        margin: -.25em;
    }

    .student-list__item {
        height: calc(2.25rem + 2px);
        background: #eee;
        border: 1px solid #ccc;
        margin: .25em;
        padding: .25em 1em;
        display: flex;
        align-items: center;
    }

    .student-list__addstudent {
        margin: .25em .25em .25em .5em;
    }

    .student-list__delete {
        margin-left: .5em;
        color: red;
        display: none;
        border: none;
        background: inherit;
        cursor: pointer;
    }

    .student-list__item:hover .student-list__delete {
        display: inline-block;
    }

    /* Group maker */
    .groupmaker__numinput {
        max-width: 6em;
    }
</style>
