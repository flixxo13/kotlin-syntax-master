export const TOPICS = [
  {
    id: "mod1",
    title: "Einführung & Setup",
    description: "Kotlin Grundlagen, Literale und dein erstes Programm.",
    icon: "BookOpen",
    order: 1,
    concepts: [
      {
        id: "intro",
        topicId: "mod1",
        title: "Was ist Kotlin?",
        syntaxRule: "fun main() { ... }",
        explanation: "Kotlin ist eine moderne, statisch typisierte Sprache.",
        example: 'fun main() {\n  println("Hello Kotlin")\n}',
        exercises: [
          {
            id: "ex1",
            conceptId: "intro",
            mode: "builder",
            task: 'Schreibe die main-Funktion, die "Hello" ausgibt.',
            initialCode: "",
            solution: 'fun main() {\n  println("Hello")\n}',
            hints: {
              level1: '... ...() {\n  ...("...")\n}',
              level2: 'fun main() {\n  println("...")\n}',
              level3: 'fun main() {\n  println("Hello")\n}'
            }
          }
        ]
      }
    ]
  },
  {
    id: "mod2",
    title: "Variablen & Syntax",
    description: "Lerne den Unterschied zwischen val und var.",
    icon: "Variable",
    order: 2,
    concepts: [
      {
        id: "valvar",
        topicId: "mod2",
        title: "val vs. var",
        syntaxRule: "val x = 10; var y = 20",
        explanation: "val ist read-only, var ist veränderbar.",
        example: 'val name = "Kotlin"\nvar age = 5',
        exercises: [
          {
            id: "ex2",
            conceptId: "valvar",
            mode: "builder",
            task: 'Deklariere eine read-only Variable "version" mit dem Wert 2.0.',
            initialCode: "",
            solution: "val version = 2.0",
            hints: {
              level1: "... version = 2.0",
              level2: "val version = ...",
              level3: "val version = 2.0"
            }
          }
        ]
      }
    ]
  }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvcGljcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb3BpYywgTGVzc29uQ2F0ZWdvcnksIEV4ZXJjaXNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgVE9QSUNTOiBUb3BpY1tdID0gW1xuICB7XG4gICAgaWQ6ICdtb2QxJyxcbiAgICB0aXRsZTogJ0VpbmbDvGhydW5nICYgU2V0dXAnLFxuICAgIGRlc2NyaXB0aW9uOiAnS290bGluIEdydW5kbGFnZW4sIExpdGVyYWxlIHVuZCBkZWluIGVyc3RlcyBQcm9ncmFtbS4nLFxuICAgIGljb246ICdCb29rT3BlbicsXG4gICAgb3JkZXI6IDEsXG4gICAgY29uY2VwdHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdpbnRybycsXG4gICAgICAgIHRvcGljSWQ6ICdtb2QxJyxcbiAgICAgICAgdGl0bGU6ICdXYXMgaXN0IEtvdGxpbj8nLFxuICAgICAgICBzeW50YXhSdWxlOiAnZnVuIG1haW4oKSB7IC4uLiB9JyxcbiAgICAgICAgZXhwbGFuYXRpb246ICdLb3RsaW4gaXN0IGVpbmUgbW9kZXJuZSwgc3RhdGlzY2ggdHlwaXNpZXJ0ZSBTcHJhY2hlLicsXG4gICAgICAgIGV4YW1wbGU6ICdmdW4gbWFpbigpIHtcXG4gIHByaW50bG4oXCJIZWxsbyBLb3RsaW5cIilcXG59JyxcbiAgICAgICAgZXhlcmNpc2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdleDEnLFxuICAgICAgICAgICAgY29uY2VwdElkOiAnaW50cm8nLFxuICAgICAgICAgICAgbW9kZTogJ2J1aWxkZXInLFxuICAgICAgICAgICAgdGFzazogJ1NjaHJlaWJlIGRpZSBtYWluLUZ1bmt0aW9uLCBkaWUgXCJIZWxsb1wiIGF1c2dpYnQuJyxcbiAgICAgICAgICAgIGluaXRpYWxDb2RlOiAnJyxcbiAgICAgICAgICAgIHNvbHV0aW9uOiAnZnVuIG1haW4oKSB7XFxuICBwcmludGxuKFwiSGVsbG9cIilcXG59JyxcbiAgICAgICAgICAgIGhpbnRzOiB7XG4gICAgICAgICAgICAgIGxldmVsMTogJy4uLiAuLi4oKSB7XFxuICAuLi4oXCIuLi5cIilcXG59JyxcbiAgICAgICAgICAgICAgbGV2ZWwyOiAnZnVuIG1haW4oKSB7XFxuICBwcmludGxuKFwiLi4uXCIpXFxufScsXG4gICAgICAgICAgICAgIGxldmVsMzogJ2Z1biBtYWluKCkge1xcbiAgcHJpbnRsbihcIkhlbGxvXCIpXFxufSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogJ21vZDInLFxuICAgIHRpdGxlOiAnVmFyaWFibGVuICYgU3ludGF4JyxcbiAgICBkZXNjcmlwdGlvbjogJ0xlcm5lIGRlbiBVbnRlcnNjaGllZCB6d2lzY2hlbiB2YWwgdW5kIHZhci4nLFxuICAgIGljb246ICdWYXJpYWJsZScsXG4gICAgb3JkZXI6IDIsXG4gICAgY29uY2VwdHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICd2YWx2YXInLFxuICAgICAgICB0b3BpY0lkOiAnbW9kMicsXG4gICAgICAgIHRpdGxlOiAndmFsIHZzLiB2YXInLFxuICAgICAgICBzeW50YXhSdWxlOiAndmFsIHggPSAxMDsgdmFyIHkgPSAyMCcsXG4gICAgICAgIGV4cGxhbmF0aW9uOiAndmFsIGlzdCByZWFkLW9ubHksIHZhciBpc3QgdmVyw6RuZGVyYmFyLicsXG4gICAgICAgIGV4YW1wbGU6ICd2YWwgbmFtZSA9IFwiS290bGluXCJcXG52YXIgYWdlID0gNScsXG4gICAgICAgIGV4ZXJjaXNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnZXgyJyxcbiAgICAgICAgICAgIGNvbmNlcHRJZDogJ3ZhbHZhcicsXG4gICAgICAgICAgICBtb2RlOiAnYnVpbGRlcicsXG4gICAgICAgICAgICB0YXNrOiAnRGVrbGFyaWVyZSBlaW5lIHJlYWQtb25seSBWYXJpYWJsZSBcInZlcnNpb25cIiBtaXQgZGVtIFdlcnQgMi4wLicsXG4gICAgICAgICAgICBpbml0aWFsQ29kZTogJycsXG4gICAgICAgICAgICBzb2x1dGlvbjogJ3ZhbCB2ZXJzaW9uID0gMi4wJyxcbiAgICAgICAgICAgIGhpbnRzOiB7XG4gICAgICAgICAgICAgIGxldmVsMTogJy4uLiB2ZXJzaW9uID0gMi4wJyxcbiAgICAgICAgICAgICAgbGV2ZWwyOiAndmFsIHZlcnNpb24gPSAuLi4nLFxuICAgICAgICAgICAgICBsZXZlbDM6ICd2YWwgdmVyc2lvbiA9IDIuMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG4iXSwibWFwcGluZ3MiOiJBQUVPLGFBQU0sU0FBa0I7QUFBQSxFQUM3QjtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1I7QUFBQSxRQUNFLElBQUk7QUFBQSxRQUNKLFNBQVM7QUFBQSxRQUNULE9BQU87QUFBQSxRQUNQLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLFNBQVM7QUFBQSxRQUNULFdBQVc7QUFBQSxVQUNUO0FBQUEsWUFDRSxJQUFJO0FBQUEsWUFDSixXQUFXO0FBQUEsWUFDWCxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixhQUFhO0FBQUEsWUFDYixVQUFVO0FBQUEsWUFDVixPQUFPO0FBQUEsY0FDTCxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1I7QUFBQSxRQUNFLElBQUk7QUFBQSxRQUNKLFNBQVM7QUFBQSxRQUNULE9BQU87QUFBQSxRQUNQLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLFNBQVM7QUFBQSxRQUNULFdBQVc7QUFBQSxVQUNUO0FBQUEsWUFDRSxJQUFJO0FBQUEsWUFDSixXQUFXO0FBQUEsWUFDWCxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixhQUFhO0FBQUEsWUFDYixVQUFVO0FBQUEsWUFDVixPQUFPO0FBQUEsY0FDTCxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7IiwibmFtZXMiOltdfQ==