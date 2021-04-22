import { GroupsDays } from './groupdays.model';
export class GroupModel {
	constructor
		(
			public gen: string,
			public group: string,
			public turn: string,
			public monday: Array<GroupsDays>,
			public tuesday: Array<GroupsDays>,
			public wednesday: Array<GroupsDays>,
			public thursday: Array<GroupsDays>,
			public friday: Array<GroupsDays>,
			public counselor: string
		) {
	}
}