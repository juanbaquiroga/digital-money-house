import { Card } from "@/components/ui/Card";

const LANDING_FEATURES = [
  {
    id: 1,
    title: "Transferí dinero",
    description:
      "Desde Digital Money House vas a poder transferir dinero a otras cuentas, asi como también recibir transferencias y nuclear tu capital en nuestra billetera virtual.",
  },
  {
    id: 2,
    title: "Pago de servicios",
    description:
      "Pagá mensualmente los servicios en 3 simples clicks. Facil, rápido y conveniente. Olvidate de las facturas en papel.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 relative">

      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[58vh] bg-[url('/landing/image.png')] bg-cover bg-center"
      />

      <div className="relative z-10 flex flex-col justify-start px-[5%] md:px-[8%] lg:px-[12%] pt-[8vh] md:pt-[12vh] lg:pt-[16vh] pb-[5vh] md:pb-[8vh] lg:pb-[10vh]">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight font-normal max-w-[55%] sm:max-w-md lg:max-w-xl">
          De ahora en adelante, hacés más con tu dinero
        </h1>
        <h2 className="text-sm sm:text-2xl md:text-3xl lg:text-4xl text-primary mt-2 md:mt-4 font-normal">
          <span className="text-white">Tu nueva</span>{" "}
          <strong className="font-bold">billetera virtual</strong>
        </h2>
      </div>

      <section className="relative flex-1 pb-[6vh]">
        
        <div className="absolute inset-0 bg-primary rounded-t-[2.5rem] z-0" />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-[4%] md:px-[5%] pt-[4%] md:pt-[3%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 w-full">
            {LANDING_FEATURES.map((feature) => (
              <Card
                key={feature.id}
                className="bg-white border-0 shadow-lg p-7 sm:p-9 md:p-10 rounded-card flex flex-col gap-4"
              >
                <div className="border-b-[3px] border-primary pb-3 sm:pb-4 mb-2 w-full">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-left">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-black text-base md:text-lg leading-relaxed font-normal">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
