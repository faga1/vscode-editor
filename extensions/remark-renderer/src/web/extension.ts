import * as vscode from 'vscode';
import { getPipeline } from './remarkRenderer';
import WebResource from './webresource';

const renderer = getPipeline();

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('remark-renderer.rendererView', () => {
		const text = vscode.window.activeTextEditor?.document.getText() ?? "*No preview available*";
		const panel = vscode.window.createWebviewPanel(
			'mdRenderer',
			'Preview',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true,
			}
		);
		panel.webview.html = getHtml(panel.webview, text, context.extensionUri);
		vscode.window.onDidChangeTextEditorSelection((e:vscode.TextEditorSelectionChangeEvent)=>{
			console.log(e);
			const newText = e.textEditor.document.getText();
			panel.webview.html = getHtml(panel.webview, newText, context.extensionUri);
		});
		vscode.window.onDidChangeTextEditorVisibleRanges((e)=>{
			console.log('onDidChangeTextEditorVisibleRanges',e);
		});
	});

	context.subscriptions.push(disposable);
	
}

function getHtml(webview: vscode.Webview, md: string, extensionUri: vscode.Uri) : string {
	const html = renderer.processSync(md).toString();
	const webRes = new WebResource(webview, extensionUri);
	return webRes.genRenderHtml(html);
}

export function deactivate() {}
