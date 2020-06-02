编译deferr后的汇编代码（go tool compile -N -l deferr.go）

```text
$ go tool objdump -s c deferr.o
TEXT %22%22.c(SB) gofile../Users/dillonliang/Desktop/dillon/me/mybook/demo/deferr.go
  deferr.go:7		0xa67			65488b0c2500000000	MOVQ GS:0, CX		[5:9]R_TLS_LE
  deferr.go:7		0xa70			483b6110		CMPQ 0x10(CX), SP
  deferr.go:7		0xa74			7672			JBE 0xae8
  deferr.go:7		0xa76			4883ec60		SUBQ $0x60, SP
  deferr.go:7		0xa7a			48896c2458		MOVQ BP, 0x58(SP)
  deferr.go:7		0xa7f			488d6c2458		LEAQ 0x58(SP), BP
  deferr.go:7		0xa84			48c744246800000000	MOVQ $0x0, 0x68(SP)
  deferr.go:8		0xa8d			c744240808000000	MOVL $0x8, 0x8(SP)
  deferr.go:8		0xa95			488d0500000000		LEAQ 0(IP), AX		[3:7]R_PCREL:%22%22.c.func1·f
  deferr.go:8		0xa9c			4889442420		MOVQ AX, 0x20(SP)
  deferr.go:8		0xaa1			488d442468		LEAQ 0x68(SP), AX
  deferr.go:8		0xaa6			4889442450		MOVQ AX, 0x50(SP)
  deferr.go:8		0xaab			488d442408		LEAQ 0x8(SP), AX
  deferr.go:8		0xab0			48890424		MOVQ AX, 0(SP)
  deferr.go:8		0xab4			e800000000		CALL 0xab9		[1:5]R_CALL:runtime.deferprocStack
  deferr.go:8		0xab9			85c0			TESTL AX, AX
  deferr.go:8		0xabb			751b			JNE 0xad8
  deferr.go:8		0xabd			eb00			JMP 0xabf
  deferr.go:12		0xabf			48c744246801000000	MOVQ $0x1, 0x68(SP)
  deferr.go:12		0xac8			90			NOPL
  deferr.go:12		0xac9			e800000000		CALL 0xace		[1:5]R_CALL:runtime.deferreturn
  deferr.go:12		0xace			488b6c2458		MOVQ 0x58(SP), BP
  deferr.go:12		0xad3			4883c460		ADDQ $0x60, SP
  deferr.go:12		0xad7			c3			RET
  deferr.go:8		0xad8			90			NOPL
  deferr.go:8		0xad9			e800000000		CALL 0xade		[1:5]R_CALL:runtime.deferreturn
  deferr.go:8		0xade			488b6c2458		MOVQ 0x58(SP), BP
  deferr.go:8		0xae3			4883c460		ADDQ $0x60, SP
  deferr.go:8		0xae7			c3			RET
  deferr.go:7		0xae8			e800000000		CALL 0xaed		[1:5]R_CALL:runtime.morestack_noctxt
  deferr.go:7		0xaed			e975ffffff		JMP %22%22.c(SB)

TEXT %22%22.c.func1(SB) gofile../Users/dillonliang/Desktop/dillon/me/mybook/demo/deferr.go
  deferr.go:9		0xb34			488b442408		MOVQ 0x8(SP), AX
  deferr.go:9		0xb39			488b00			MOVQ 0(AX), AX
  deferr.go:9		0xb3c			488b4c2408		MOVQ 0x8(SP), CX
  deferr.go:9		0xb41			48ffc0			INCQ AX
  deferr.go:9		0xb44			488901			MOVQ AX, 0(CX)
  deferr.go:10		0xb47			c3			RET

```