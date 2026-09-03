import HomeScreen from "@/screens/HomeScreen";
import { getAllSections } from "@/api/content";
import { getServices } from "@/api/services";
import { getExperience } from "@/api/experience";

// Contenido editable desde /admin (Supabase) -- se revalida cada 60s para
// que los cambios publicados desde el panel aparezcan sin tener que
// redesplegar (equivalente al ISR real que no existe en una exportación
// estática).
export const revalidate = 60;

export default async function Page() {
  let sections = null;
  let services = [];
  let experience = [];
  let error = null;

  try {
    [sections, services, experience] = await Promise.all([
      getAllSections(),
      getServices(),
      getExperience(),
    ]);
  } catch (err) {
    error = err.message;
  }

  return (
    <HomeScreen
      sections={sections}
      services={services}
      experience={experience}
      error={error}
    />
  );
}
