const fs = require("fs");

const code = `
center,
left 100,
color blue,
top 10,
bottom 100,
right 100,
top 200,
right 100,
`;

function tokenize(code) {
	const tokens = [];
	let i = 0;

	function addToken(type, value) {
		tokens.push({
			type,
			value,
		});
	}

	while (i < code.length) {
		const char = code[i];

		switch (char) {
			case " ":
			case "\t":
			case "\n":
			case "\r":
				i++;
				break;
			case ",":
				addToken("COMMA", char);
				i++;
				break;
			default:
				const isDigit = /\d/.test(char);
				const isLetter = /[a-z]/i.test(char);

				if (isDigit) {
					let number = "";
					while (i < code.length && /\d/.test(code[i])) {
						number += code[i];
						i++;
					}
					addToken("NUMBER", number);
				} else if (isLetter) {
					let name = "";
					while (i < code.length && /[a-z]/i.test(code[i])) {
						name += code[i];
						i++;
					}
					addToken("NAME", name);
				} else {
					throw new Error(`Unknown character: ${char}`);
				}
				break;
		}
	}

	return tokens;
}

const tokens = tokenize(code);
console.log(tokens);

function compile(tokens) {
	let i = 0;
	let out = "";

	let addCode = (code) => {
		out += code + "\n";
	};

	while (i < tokens.length) {
		const token = () => tokens[i];

		function expect(type) {
			if (tokens[++i].type !== type) {
				throw new Error(`Expected ${type}, got ${tokens[i].type}`);
			}
		}

		switch (token().type) {
			case "COMMA":
				addCode(`_draw();`);
				break;

			case "NAME":
				/**
				 * If the name is center, execute the center function
				 */
				if (token().value === "center") {
					addCode(`_center();`);
				} else if (token().value === "color") {
					/**
					 * If the name is color, expect a name and set the color
					 */
					expect("NAME");
					addCode(`_setColor("${token().value}");`);
				} else if (
					/**
					 * If the name is left/right/top/bottom, expect a number and execute the corresponding function
					 */
					token().value === "left" ||
					token().value === "right" ||
					token().value === "top" ||
					token().value === "bottom"
				) {
					expect("NUMBER");
					const value = parseInt(token().value);

					addCode(`_${tokens[i - 1].value}(${value});`);
				} else {
					throw new Error(`Unknown name: ${token().value}`);
				}
		}

		i++;
	}

	return out;
}

const compiled = compile(tokens);
console.log(compiled);
console.log("Compiled code successfully");

fs.writeFileSync("out.js", compiled);
