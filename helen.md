```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "helen.fullname" . }}
  labels:
    {{- include "helen.labels" . | nindent 4 }}
spec:
{{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
{{- end }}
  selector:
    matchLabels:
      {{- include "helen.selectorLabels" . | nindent 6 }}
  template:
    metadata:
    {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
    {{- end }}
      labels:
        {{- include "helen.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "helen.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: ENV
              value: "{{ .Values.env }}"
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /ping
              port: http
          readinessProbe:
            httpGet:
              path: /ping
              port: http
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          volumeMounts:
            - name: log-dir
              mountPath: /log
      {{- if .Values.vector.enabled -}}
        - name: vector
          image: "docker.io/timberio/vector:0.11.1-alpine"
          imagePullPolicy: "IfNotPresent"
          args:
            - --watch-config
            - /etc/vector/*.toml
            - --config
            - /etc/vector/*.toml
          ports:
            - name: metrics
              containerPort: 9090
              protocol: TCP
          resources:
            requests:
              cpu: 200m
              memory: 200Mi
            limits:
              cpu: 200m
              memory: 200Mi
          volumeMounts:
            - name: log-dir
              mountPath: /log
            - name: vector-config
              mountPath: /etc/vector
              readOnly: true
      {{- end }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      volumes:
        - name: vector-config
          configMap:
            name: vector-config
        - name: log-dir
          emptyDir: {}
```
