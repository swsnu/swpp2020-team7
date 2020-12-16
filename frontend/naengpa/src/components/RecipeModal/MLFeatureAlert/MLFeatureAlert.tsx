import React from 'react';
import { History } from 'history';
import Alert from '@material-ui/lab/Alert';
import { Collapse, Button } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalDiningIcon from '@material-ui/icons/LocalDining';

interface MLFeatureAlertProps {
	history: History;
	alert: boolean;
	alertContent: string;
	onClickOffAlert: (
		e:
			| React.MouseEvent<SVGSVGElement, MouseEvent>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => void;
	goBack: boolean;
	onClickCancelAlert: (e: React.MouseEvent<HTMLButtonElement>) => void;
	createLoading: boolean;
}

const MLFeatureAlert: React.FC<MLFeatureAlertProps> = ({
	history,
	alert,
	alertContent,
	onClickOffAlert,
	goBack,
	onClickCancelAlert,
	createLoading,
}) => {
	return (
		<Collapse className="collapse" in={alert}>
			<Alert id="extract-ml-feature-alert" icon={false}>
				<div id="naengpa-logo-box">
					<div id="naengpa-logo">
						<LocalDiningIcon id="naengpa-logo-image" />
						냉파
					</div>
					{!createLoading && (
						<CancelIcon id="close-alert-button" onClick={onClickOffAlert} />
					)}
				</div>
				<div id="alert-content">{alertContent}</div>
				<div id="confirm-alert-button-box">
					{!goBack && !createLoading && (
						<Button id="confirm-alert-button" onClick={onClickOffAlert}>
							확인
						</Button>
					)}
					{goBack && (
						<>
							<Button
								id="confirm-alert-button"
								onClick={() => {
									history.goBack();
								}}
							>
								확인
							</Button>
							<Button id="cancel-alert-button" onClick={onClickCancelAlert}>
								취소
							</Button>
						</>
					)}
				</div>
			</Alert>
		</Collapse>
	);
};

export default MLFeatureAlert;
