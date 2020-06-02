package main

func main() {
	println(c())
}

func c() (i int) {
	defer func() {
		i++
	}()

	return 1
}
