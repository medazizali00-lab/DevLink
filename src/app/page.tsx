import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Code } from "lucide-react"; // Icônes de liens

// Structure des liens (vos données personnelles)
const links = [
  { name: "GitHub Profil", url: `https://github.com/${process.env.GITHUB_USERNAME}`, icon: <Github className="w-5 h-5" /> },
  { name: "LinkedIn", url: "https://linkedin.com/in/VotreProfil", icon: <Linkedin className="w-5 h-5" /> },
  { name: "Portfolio / CV", url: "https://votre-portfolio.com", icon: <Code className="w-5 h-5" /> },
  { name: "Contact Mail", url: "mailto:votre.mail@email.com", icon: <Mail className="w-5 h-5" /> },
];
import { Star, GitBranch } from "lucide-react"; // Ajoutez ces icônes
// ... (imports existants)

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

// Fonction asynchrone pour l'appel API GitHub
// ... (imports et interface Repo)

async function getGithubRepos(): Promise<Repo[]> {
  const username = process.env.GITHUB_USERNAME; 
  const token = process.env.GITHUB_TOKEN; 

  console.log("Valeur lue de GITHUB_USERNAME:", username); // Affichage correct

  if (!username) return [];

  const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=3`;
  
  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `token ${token}` } : {},
      next: { revalidate: 60 * 60 * 4 }, 
    });
    
    // --- NOUVEAU CODE DE DÉBOGAGE ICI ---
    if (!res.ok) {
      console.error(`🚨 ÉCHEC API GITHUB. URL: ${url}. Statut: ${res.status} ${res.statusText}`);
      const errorText = await res.text(); // Tentative de lire le corps de l'erreur
      console.error("Corps de la réponse d'erreur:", errorText.substring(0, 200) + '...');
      return [];
    }

    // --- FIN NOUVEAU CODE ---
    
    const data = await res.json();
    
    // VÉRIFICATION DU NOMBRE DE REPOS
    console.log(`✅ Succès API GitHub. Nombre de repos trouvés: ${data.length}`); 
    return data;

  } catch (error) {
    console.error("❌ Erreur de connexion au réseau GitHub:", error);
    return [];
  }
}
// Changez la fonction pour qu'elle soit async
export default async function Home() { 
  
  // 1. Appel de la fonction pour récupérer les données avant le rendu
  const repos = await getGithubRepos(); 
  
  // ... (Structure existante du composant Home)
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* ... (En-tête de Profil et Liens existants) */}

        {/* Section Repos GitHub (NOUVEAU CONTENU) */}
        <div id="github-repos-section" className="pt-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-50">Projets Récents</h2>
          <div className="space-y-4">
            {repos.length > 0 ? (
              repos.map((repo) => (
                <Card key={repo.id} className="text-left hover:border-slate-400 dark:hover:border-slate-500 transition-all">
                  <CardContent className="p-4">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200 truncate">{repo.name}</h3>
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{repo.description || "Pas de description fournie."}</p>
                    <div className="flex items-center text-xs mt-3 text-gray-600 dark:text-gray-400 space-x-4">
                      {/* Affichage des étoiles */}
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {repo.stargazers_count}
                      </span>
                      {/* Affichage du langage */}
                      {repo.language && (
                        <span className="flex items-center">
                          <GitBranch className="w-3 h-3 mr-1" />
                          {repo.language}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-500">Chargement des repos ou GITHUB_USERNAME non défini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}