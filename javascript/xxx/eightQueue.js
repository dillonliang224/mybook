
// 8皇后

let result = []
let count = 0
calQueue(0)
console.log(count, '---')

function calQueue(row) {
	console.log("row ->", row)
	if (row >= 8) {
		count++
		printQueue(result)
		return
	}

	for (let column = 0; column < 8; ++column) {
		if (isOk(row, column)) {
			result[row] = column
			calQueue(row+1)
		}
	}
}

function isOk(row, column) {
	let leftUp = column - 1
	let rightUp = column + 1

	for (let i = row - 1; i >= 0; --i) {
		if (result[i] === column) return false

		if (leftUp >= 0) {
			if (result[i] === column) return false
		}

		if (rightUp < 8) {
			if (result[i] === column) return false
		}

		--leftUp
		++rightUp
	}

	return true
}

function printQueue(result) {
	for (let row = 0; row < 8; row++) {
		let str = ''
		for (let column = 0; column < 8; ++column) {
			if (result[row] === column) str += 'Q '
			str += '* '
		}
		console.log(str)
	}
}