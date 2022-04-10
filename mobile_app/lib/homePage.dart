import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_app/yearSelector.dart';

class HomePage extends StatefulWidget {
  const HomePage({ Key? key, required this.token }) : super(key: key);
  final String token;

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {  //"http://conta-ore-straordinari.herokuapp.com/api/v1/years"
  final Uri urlYears = Uri.parse("http://192.168.1.2:3000/api/v1/years");
  List<dynamic> years = [];
  late dynamic yearSelected = connected ? years[0]['year'] : DateTime.now().toLocal().year.toInt();
  
  bool connected = false;
  
  Future getYears(token) async{
    http.get(urlYears, 
      headers: {
        'authorization': token
      }
    ).then((value){
      if(value.statusCode == 200){
        years = jsonDecode(value.body);
        setState(() {
          connected = true;
        });
      }
      else{
        showDialog(context: context, 
          builder: (BuildContext context) => errorAlert
        );
      }
    });
  }

  AlertDialog errorAlert = AlertDialog(
    title: const Text("Impossibile connettersi al Server"),
    content: const Text("C'è stato un errore nel collegamento con il server, è consigliato controllare la propria connessione internet e riprovare"),
    actions: [
      TextButton(onPressed: () => {}, //TODO risovlere chiamata getYears
        child: const Text("Riprova")
      )    
    ],
  );

  @override
  void initState(){
    getYears(widget.token);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).backgroundColor,
      appBar: AppBar(
        title: Text("CONTA ORE STRAORDINARIO",
          style: Theme.of(context).textTheme.headline2,
        ),
        centerTitle: true,
        automaticallyImplyLeading: false,
        backgroundColor: Theme.of(context).primaryColor
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          const SizedBox(height: 15),
          connected ? YearSelector(yearSelected: yearSelected, years: years) 
            : const Text(""),
        ],
      ),
    );
  }
}