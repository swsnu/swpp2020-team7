import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { Collapse, Button } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalDiningIcon from '@material-ui/icons/LocalDining';

interface CreateRecipeAlertProps {
	alert: boolean;
	alertContent: string;
	onClickOffAlert: (
		e:
			| React.MouseEvent<SVGSVGElement, MouseEvent>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => void;
}

const CreateRecipeAlert: React.FC<CreateRecipeAlertProps> = ({
	alert,
	alertContent,
	onClickOffAlert,
}) => {
	return (
		<Collapse className="collapse" in={alert}>
			<Alert id="create-recipe-alert" icon={false}>
				<div id="naengpa-logo-box">
					<div id="naengpa-logo">
						<LocalDiningIcon id="naengpa-logo-image" />
						냉파
					</div>
					<CancelIcon id="close-alert-button" onClick={onClickOffAlert} />
				</div>
				<div id="alert-content">{alertContent}</div>
				<div id="confirm-alert-button-box">
					<Button id="confirm-alert-button" onClick={onClickOffAlert}>
						확인
					</Button>
				</div>
			</Alert>
		</Collapse>
	);
};

export default CreateRecipeAlert;
