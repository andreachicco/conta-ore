import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class HomePage extends StatefulWidget {
  const HomePage({ Key? key, required this.token }) : super(key: key);
  final String token;

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final Uri urlYears = Uri.parse("http://conta-ore-straordinari.herokuapp.com/api/v1/years");
  List<dynamic> years = [];
  
  AlertDialog errorAlert = AlertDialog(
    title: const Text("Impossibile connettersi al Server",),
    content: const Text("C'è stato un errore mentre nel collegamento con il sever, è consigliato controllare la propria connessione internet e riprovare"),
    actions: [
      TextButton(onPressed: () => {},
        child: const Text("Riprova")
      )
    ],
  );

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

  @override
  void initState(){
    getYears(widget.token);
    super.initState();
  }

  late dynamic yearSelected = connected ? years[0]['year'] : DateTime.now().toLocal().year.toInt();

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
          connected ? Center(
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(5)
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 5),
                child: DropdownButton(
                  icon: const Icon(Icons.arrow_drop_down_circle_outlined),
                  iconSize: 18,
                  borderRadius: BorderRadius.circular(10),
                  value: yearSelected,
                  items: years.map((dynamic e) {
                    return DropdownMenuItem<dynamic>(
                      value: e['year'],
                      child: Text("${e['year']}",
                        style: Theme.of(context).textTheme.headline2,
                      ),
                    );
                  }).toList(), 
                  onChanged: (dynamic year) {
                    setState(() {
                      yearSelected = year;
                    });
                  },
                ),
              ),
            ),
          ) : const Text("")
        ],
      ),
    );
  }
}