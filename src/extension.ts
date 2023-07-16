import * as vscode from "vscode";
const decType = vscode.window.createTextEditorDecorationType({});
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vscode-comment-tip" is now active!'
  );

  let editorW = vscode.window.activeTextEditor;
  if (editorW) {
    addCommentDesDetail(editorW);
  }
  vscode.window.onDidChangeTextEditorVisibleRanges(({ textEditor }) => {
    textEditor.setDecorations(decType, []);
    addCommentDesDetail(textEditor);
  });
}

export function deactivate() {}

/** 根据可视范围获得折叠区域 */
function getCommentFoldArr(editor: vscode.TextEditor) {
  const { visibleRanges: randes } = editor;
  let visibleArrLength = randes.length;
  let startIndex = 0;
  let foldArr: { start: number; end: number }[] = [];
  while (startIndex + 1 < visibleArrLength) {
    if (
      editor.document.lineAt(randes[startIndex].end.line).text.includes("/**")
    ) {
      foldArr.push({
        start: randes[startIndex].end.line,
        end: randes[startIndex + 1].start.line,
      });
    }
    startIndex += 1;
  }
  return foldArr;
}

/** 给某一行添加描述信息 */
function addlineDecorationOptions(line: number, text: string) {
  return {
    renderOptions: {
      dark: {
        after: { color: "#7cc36e" },
      },
      light: {
        after: { color: "#7cc36e" },
      },
      after: {
        contentText: text.replace("* ", ""),
      },
    },
    range: new vscode.Range(
      new vscode.Position(line, 1024),
      new vscode.Position(line, 1024)
    ),
  };
}

/** 给 editor 的折叠区域添加描述信息 */
function addCommentDesDetail(editor: vscode.TextEditor) {
  const foldArr = getCommentFoldArr(editor);
  editor.setDecorations(
    decType,
    foldArr.map((item) => {
      return addlineDecorationOptions(
        item.start,
        editor.document.lineAt(item.start + 1).text
      );
    })
  );
}
