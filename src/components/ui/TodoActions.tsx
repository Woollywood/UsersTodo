import TodoCreate from './TodoCreate';

interface Props {
	onCreate: () => void;
}

export default function TodoActions({ onCreate }: Props) {
	return (
		<div>
			<TodoCreate onCreate={() => onCreate()} />
		</div>
	);
}
