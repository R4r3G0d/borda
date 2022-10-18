FROM alpine:latest 

#RUN  apk add --update make

COPY . .

ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN go build -o ./yummy-brawlers ./main.go

FROM alpine:latest

#RUN apk add --no-cache ca-certificates

COPY --from=builder ./yummy-brawlers .

EXPOSE 3000

ENTRYPOINT ["./yummy-brawlers"]+