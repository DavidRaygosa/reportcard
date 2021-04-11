import { TeacherSubject } from './teachersubject.model';
import { TeacherGroup } from './teachergroup.model';

export class TeacherModel {
	constructor
		(
			public name: string,
			public lastnamep: string,
			public lastnamem: string,
			public grade: string,
			public turn: string,
			public subjects: Array<String>,
			public groups: Array<TeacherGroup>
		) {
	}
}