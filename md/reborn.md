## Reborn

### 项目结构

```md
- build   
- charts
-
```



##### http router代码

```go
engine := gin.New()
engine.Use(Cross(), Logger(), Monitoring(), Tracing(), Recovery())
```

CORS/日志/监控/跟踪/Recovery/



##### debug router代码

```go
	debugMux := http.NewServeMux()
	debugMux.Handle("/metrics", promhttp.Handler())
	debugMux.Handle("/healthz", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		res := map[string]string{
			"status": "UP",
		}
		statusCode := http.StatusOK
		if err := svc.Ping(r.Context()); err != nil {
			statusCode = http.StatusInternalServerError
			res["status"] = "DOWN"
			res["err"] = err.Error()
		}

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(statusCode)
		json.NewEncoder(w).Encode(res)
	}))

	debugMux.HandleFunc("/debug/pprof/", pprof.Index)
	debugMux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	debugMux.HandleFunc("/debug/pprof/profile", pprof.Profile)
	debugMux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	debugMux.HandleFunc("/debug/pprof/trace", pprof.Trace)
```



debug接口主要用户methrics/监控检查/pprof



##### grpc 启动

```go
func UnaryServerInterceptor(opts ...Option) grpc.UnaryServerInterceptor {

	opt := evaluateOption(opts)

	grpc_prometheus.EnableHandlingTimeHistogram(
		grpc_prometheus.WithHistogramBuckets(opt.buckets),
	)

	tagOpts := []grpc_ctxtags.Option{
		// grpc_ctxtags.WithFieldExtractor(grpc_ctxtags.TagBasedRequestFieldExtractor("log_fields")),
	}

	opt.logger = opt.logger.WithOptions(zap.AddStacktrace(zap.ErrorLevel + 1))

	defaultInterceptors := []grpc.UnaryServerInterceptor{
		unaryServerLog(opt.logger),
		unaryServerRateLimit(opt.limiter),
		grpc_validator.UnaryServerInterceptor(),
		grpc_ctxtags.UnaryServerInterceptor(tagOpts...),
		grpc_prometheus.UnaryServerInterceptor,
		grpc_opentracing.UnaryServerInterceptor(grpc_opentracing.WithTracer(opt.tracer)),
		unaryServerRecover(opt.logger),
	}

	interceptors := append(defaultInterceptors, opt.serverInterceptors...)
	return grpc_middleware.ChainUnaryServer(interceptors...)
}
```



日志/速率/校验/跟踪/监控
