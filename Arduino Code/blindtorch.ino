int echopin = 4;
int trigpin= 5;
int buzzer= 10;
int led = 8;
float duration;
float distance;

void setup() {
  pinMode(echopin, INPUT);
  pinMode(trigpin,OUTPUT);
  pinMode(buzzer,OUTPUT);
  pinMode(led,OUTPUT);
  digitalWrite(led,HIGH);
  Serial.begin(9600);
  delay(100);
  

}

void loop() {
  
  digitalWrite(trigpin,LOW);
  delayMicroseconds(10);
   digitalWrite(trigpin,HIGH);
  delayMicroseconds(10);
   digitalWrite(trigpin,LOW);
  delayMicroseconds(10);
  duration = pulseIn(echopin,HIGH);
  Serial.println(duration);
  distance= ((34400*duration)/(2*1000000));
  if(distance<=50)
  {
    digitalWrite(buzzer,HIGH);
    
  }
  else
  {
    digitalWrite(buzzer,LOW);
    
   }
  
  
  

}
