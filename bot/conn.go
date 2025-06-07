package conn

import (
	"aurora/bot/config"
	"aurora/bot/handlers"
	"aurora/bot/helpers"
	"context"
	"os"
	"os/signal"
	"regexp"
	"syscall"

	_ "aurora/plugins"

	_ "github.com/lib/pq"
	"github.com/mdp/qrterminal"
	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waCompanionReg"
	"go.mau.fi/whatsmeow/store"
	"go.mau.fi/whatsmeow/store/sqlstore"
	"go.mau.fi/whatsmeow/types"
	waLog "go.mau.fi/whatsmeow/util/log"
	"google.golang.org/protobuf/proto"
)

type Template struct {
	Nama   string
	Status bool
}

var log helpers.Logger
var dbLog waLog.Logger

func init() {
	store.DeviceProps.PlatformType = waCompanionReg.DeviceProps_EDGE.Enum()
	store.DeviceProps.Os = proto.String("Linux")
}

func StartClient() {
	var goEnv = config.GlobalConfig.Go_Env
	if goEnv == "development" {
		dbLog = waLog.Stdout("Database", "DEBUG", true)
	} else {
		dbLog = waLog.Stdout("Database", "INFO", false)
	}

	ctx := context.Background()
	dbType, dbURL := config.GetDatabaseConfig()
	container, err := sqlstore.New(ctx, dbType, dbURL, dbLog)
	if err != nil {
		panic(err)
	}

	handler := handlers.NewHandler(container)
	log.Info("Connecting to WhatsApp... Please Wait.")
	conn := handler.Client()
	conn.PrePairCallback = func(jid types.JID, platform, businessName string) bool {
		log.Info("Login Successful!")
		return true
	}

	if conn.Store.ID == nil {
		// No ID stored, new login
		pairingNumber := os.Getenv("PAIRING_NUMBER")

		if pairingNumber != "" {
			pairingNumber = regexp.MustCompile(`\D+`).ReplaceAllString(pairingNumber, "")

			if err := conn.Connect(); err != nil {
				if conn.IsLoggedIn() {
					log.Info("✅ Already logged in to WhatsApp")
				}
				panic(err)
			}

			ctx := context.Background()
			code, err := conn.PairPhone(ctx, pairingNumber, true, whatsmeow.PairClientChrome, "Edge (Linux)")

			if err != nil {
				panic(err)
			}

			log.Info("Your Paring Code : " + code)
		} else {
			qrChan, _ := conn.GetQRChannel(context.Background())
			if err := conn.Connect(); err != nil {
				panic(err)
			}

			for evt := range qrChan {
				switch string(evt.Event) {
				case "code":
					qrterminal.GenerateHalfBlock(evt.Code, qrterminal.L, os.Stdout)
					log.Info("Scan Qr To Connect")
				}
			}
		}
	} else {
		// Already logged in, just connect
		if err := conn.Connect(); err != nil {
			panic(err)
		}
		log.Info("Login Successful!")
	}

	// Handle graceful shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c
	log.Info("Shutting down gracefully...")
	conn.Disconnect()
}
