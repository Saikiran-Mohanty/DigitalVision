#include <ESP8266WiFi.h>
#include<ESP8266HTTPClient.h>
float h, t;
char* ssid = "YU5012";
char* pass = "12345678";
char ip[] = "184.106.153.149";
String host = "api.thingspeak.com";
int httpport = 80;
String url1 = "/update?api_key=IE2KC46L8HLWFWMD&field1=";
String httpmethod = "GET";
HTTPClient http;
WiFiClient client;
void setup() { 
  Serial.begin(9600);
  Serial.println("Connecting to WiFi");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("WiFi Connected");
  Serial.println(WiFi.localIP());

}

void loop() {
   if (client.connect(ip, 80))
   {
     int heartbeat = 90;
     int distance = 20;
     String location= "Bhubaneshwar,Odisha";
      Serial.println(heartbeat);
      Serial.println(distance);
      Serial.println(location);
      String link1 = url1 + (String)heartbeat + "&field2="+(String)distance+"&field3="+ location;
       Serial.println(link1);
            http.begin(client,host,httpport,link1);
            int httpcode = http.GET();
            Serial.println(httpcode);
            delay(2000);
    
   }

}
