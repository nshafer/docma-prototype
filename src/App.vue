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
                    <div v-for="(students, cls) in classlist" :key="cls" class="cls card mb-3">
                        <div class="card-body">
                            <div class="card-title d-flex justify-content-between">
                                <h5>{{ cls }}</h5>
                                <div class="cls__actions">
                                    <button class="cls__import btn btn-secondary btn-sm ml-2"
                                            @click="importClass(cls)">
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
                                    <div v-for="student in students" :key="student" class="student-list__item">
                                        {{ student }}
                                        <button class="student-list__delete" @click="deleteStudent(cls, student)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                    <div class="student-list__addstudent">
                                        <div class="input-group">
                                            <input class="form-control -addstudent" type="text" placeholder="Add student"
                                                   @keyup.enter="addStudent(cls, $event)"/>
                                            <div class="input-group-append">
                                                <button class="btn btn-primary" type="button" @click="addStudent(cls, $event)">Add</button>
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
                <h2>Group Maker</h2>

                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn btn-primary active">
                        <input type="radio" name="options" autocomplete="off" checked>
                        groups
                    </label>
                    <label class="btn btn-primary active">
                        <input type="radio" name="options" autocomplete="off">
                        per group
                    </label>
                </div>
            </div>
        </div>

        <!-- Import modal -->
        <div class="modal fade" id="import-students-modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Import Students for {{ importing_class }}</h5>
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
                        <button type="button" class="btn btn-primary" @click="doImport">Import</button>
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
                        <button type="button" class="btn btn-primary" @click="doRestore">Restore Data</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { b64EncodeUnicode, b64DecodeUnicode } from "./util";

    export default {
        name: 'app',
        data () {
            return {
                newclass: '',
                importing_class: '',
                import_list: '',
                restore_data: '',
                classlist: {
                    "Period 1": ["Gilligan", "Skipper", "Maryanne"],
                    "Period 2": ["Michael Scott", "Dwight Schrute", "Jim Halpert", "Pam Beasley"],
                },
            }
        },

        methods: {
            addClass() {
                if (this.classlist[this.newclass] === undefined) {
                    this.$set(this.classlist, this.newclass, []);
                }
                this.newclass = '';
            },

            deleteClass(name) {
                this.$delete(this.classlist, name);
            },

            addStudentToClass(cls, student) {
                if (!this.classlist[cls].includes(student)) {
                    this.classlist[cls].push(student)
                }
            },

            addStudent(cls, event) {
                const student = event.target.value;
                this.addStudentToClass(cls, student);
                event.target.value = '';
            },

            deleteStudent(cls, student) {
                this.classlist[cls].splice(this.classlist[cls].indexOf(student), 1);
            },

            importClass(cls) {
                this.import_list = '';
                this.importing_class = cls;
                $("#import-students-modal").modal('show');
            },

            doImport() {
                const lines = this.import_list.split('\n');
                for (let line of lines) {
                    let student = line.trim();
                    this.addStudentToClass(this.importing_class, student);
                }
                $("#import-students-modal").modal('hide');
            },

            doRestore() {
                const data = JSON.parse(b64DecodeUnicode(this.restore_data));
                this.classlist = data;
                $("#restore-modal").modal('hide');
            }
        },

        computed: {
            backup_data () {
                return b64EncodeUnicode(JSON.stringify(this.classlist));
            },
        },

        watch: {
            classlist: {
                handler() {
                    localStorage.setItem('classlist', JSON.stringify(this.classlist));
                },
                deep: true,
            },
        },

        mounted () {
            if (localStorage.getItem('classlist')) {
                this.classlist = JSON.parse(localStorage.getItem('classlist'));
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

    .student-list__item.-addstudent {
        background: inherit;
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
</style>
