import * as vscode from 'vscode';

let cigaretteStatus: vscode.StatusBarItem;
let gcigaretteSmoked = 0;
const update = 'Lung capacity decreasing. Please smoke responsibly!';
let messages = [
	'Keep going! ',
	'Another one bites the dust!',
	'You can do it! -Cigarette',
	'Take a deep breath... or maybe not!',
	'Cigarettes: tiny sticks of relaxation.',
	'Behind every stressed coder is a pack of cigarettes.',
	'So many puffs, so little time.',
	'Good ideas start with a smoke break.',
	'I turn stress into smoke.'
];

export function activate(context: vscode.ExtensionContext) {

	const cigaretteCount = 'cigarette.getCigaretteCount';
	const cigaretteAdd = 'cigarette.addCigaretteCount';
	const cigaretteRefresh = 'cigarette.refresh';
	const cigaretteUpdate = 'cigarette.cigaretteUpdate';
	const cigaretteReset = 'cigarette.cigaretteReset';
	const gcigaretteCan = context.globalState.get("gConsumed", gcigaretteSmoked);
	gcigaretteSmoked = gcigaretteCan;

	// Register commands
	context.subscriptions.push(vscode.commands.registerCommand(cigaretteAdd, () => {
		addCigaretteCount();
		let i = randMessage();
		context.globalState.update("gConsumed", getCigaretteConsumed());
		updateStatusbarItem();
		refreshTreeView();
		vscode.window.showInformationMessage(messages[i]);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(cigaretteCount, () =>{
		vscode.window.showInformationMessage(getCigaretteConsumed() + ' consumed.');
	}));

	context.subscriptions.push(vscode.commands.registerCommand(cigaretteReset, () => {
		gcigaretteSmoked = 0;
		context.globalState.update("gConsumed", getCigaretteConsumed());
		updateStatusbarItem();
		vscode.window.showInformationMessage('Cigarette count has been reset.');
	}));

	context.subscriptions.push(vscode.commands.registerCommand(cigaretteUpdate, () =>{
		vscode.window.showInformationMessage(update);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(cigaretteRefresh, () => {
		refreshTreeView();
	}));

	vscode.window.createTreeView('cigaretteView', {
		treeDataProvider: CigaretteProvider()
	});

	function CigaretteProvider(): vscode.TreeDataProvider<{}> {  
		return{
			getChildren,
			getTreeItem        
		};
	}
	
	async function getChildren(element: string): Promise<string[]> {
		return [
			gcigaretteCan.toString()
		];
	}
	
	function getTreeItem(item: string): vscode.TreeItem {
		return{
			id: 'gconsumed',
			collapsibleState: void 0,
			label:'Consumed - '+ gcigaretteSmoked.toString(),
			tooltip: 'Cigarettes consumed'
		};
	}

	function refreshTreeView(){
		let obj = getTreeItem('gconsumed');
		obj.label = 'Consumed - '+ gcigaretteSmoked.toString();
		obj.contextValue = gcigaretteSmoked.toString();

		vscode.window.createTreeView('cigaretteView', {
			treeDataProvider: CigaretteProvider()
		});
	}

	cigaretteStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	cigaretteStatus.color = '#bb8';

	cigaretteStatus.command = cigaretteAdd;
	context.subscriptions.push(cigaretteStatus);

	updateStatusbarItem();
}

function getCigaretteConsumed(){
	return gcigaretteSmoked;
}

function addCigaretteCount():void{
	gcigaretteSmoked++;
	cigaretteTimer();
}

function cigaretteTimer(){
	let t = 1200000; 
	setTimeout(updateMsg, t);
}

function updateMsg(){
	vscode.window.showInformationMessage('Time for another smoke break?');
}

function randMessage(){
	return Math.floor((Math.random() * messages.length));
}

function updateStatusbarItem()
{
	let n = getCigaretteConsumed();

	if(n === 1)
	{
		cigaretteStatus.text = '$(flame) '+ n +' cigarette consumed!';
		vscode.window.showInformationMessage('First puff taken!');
		cigaretteStatus.show();
	}
	else if( n > 1 && n < 10)
	{
		cigaretteStatus.text = '$(flame) '+ n +' cigarettes consumed!';
		cigaretteStatus.show();
	}
	else if(n >= 10)
	{
		cigaretteStatus.text = '$(rocket) '+ n +' cigarettes consumed!';
		cigaretteStatus.show();
	}
	else
	{
		cigaretteStatus.text = '$(flame) Need a smoke?';
		cigaretteStatus.show();
	}
}

export function deactivate() {}
