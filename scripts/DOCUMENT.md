# Scripts

## z-to-type

cmd: bun run genc {string}"<"COMPONENT_NAME">" [-p | --props]

COMPONENT_NAMEを文字列で渡すと、PascalCaseに変換して、ひな形を生成します。
-p | --propsで、Propsの型定義のひな形も生成。
実行時はdescriptionを入力する画面になります。空行でこの画面は閉じられます。
