package main

import "fmt"

func main() {
	f()
	fmt.Println("Returned normally from f.")
}

func f() {
	// defer func() {
	// 	if r := recover(); r != nil {
	// 		fmt.Println("Recovered in f: ", r)
	// 	}
	// }()

	fmt.Println("Calling g.")
	g(0)
	fmt.Println("Returned normally from g.")
}

func g(i int) {
	if i > 3 {
		fmt.Println("Panicking")
		panic(fmt.Sprintf("%v", i))
	}

	defer fmt.Println("defer in g ", i)
	fmt.Println("Printing in g ", i)
	g(i + 1)
}

/*
Calling g.
Printing in g 0
Printing in g 1
Printing in g 2
Printing in g 3
Panicking
defer in g 3
defer in g 2
defer in g 1
defer in g 0
Recovered in f: 4
Returned normally from f.
*/
