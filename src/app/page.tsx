import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Code, Star, GitBranch } from "lucide-react"; // Toutes les icônes
import { ModeToggle } from "@/components/mode-toggle"; 
import QRCode from 'react-qr-code'; // Ajout de l'import pour le QR Code

// --- Interfaces et Données ---

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

// Structure des liens (À PERSONNALISER)
const links = [
  { name: "GitHub Profil", url: `https://github.com/${process.env.GITHUB_USERNAME}`, icon: <Github className="w-5 h-5" /> },
  { name: "LinkedIn", url: "https://linkedin.com/in/VotreProfil", icon: <Linkedin className="w-5 h-5" /> },
  { name: "Portfolio / CV", url: "https://votre-portfolio.com", icon: <Code className="w-5 h-5" /> },
  { name: "Contact Mail", url: "mailto:votre.mail@email.com", icon: <Mail className="w-5 h-5" /> },
];

// --- Fonction getGithubRepos (Server-Side) ---

async function getGithubRepos(): Promise<Repo[]> {
  const username = process.env.GITHUB_USERNAME; 
  const token = process.env.GITHUB_TOKEN; 

  // console.log("Valeur lue de GITHUB_USERNAME:", username); // Nettoyage du log de débogage

  if (!username) return [];

  const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=3`;
  
  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `token ${token}` } : {},
      next: { revalidate: 60 * 60 * 4 }, 
    });
    
    if (!res.ok) {
      console.error(`🚨 ÉCHEC API GITHUB. Statut: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    // console.log(`✅ Succès API GitHub. Nombre de repos trouvés: ${data.length}`); // Nettoyage du log de débogage
    return data;

  } catch (error) {
    console.error("❌ Erreur de connexion au réseau GitHub:", error);
    return [];
  }
}

// --- Composant Principal Home (Server Component) ---

export default async function Home() { 
  const repos = await getGithubRepos(); 
  // Remplacez par votre URL Vercel réelle pour le QR Code
  const vercelUrl = "https://devlink-votre-nom.vercel.app"; 
  
  return (
    // 'relative' est crucial pour positionner les éléments 'absolute'
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      
      {/* ⬅️ MODE TOGGLE ET QR CODE */}
      <div className="absolute top-4 right-4 z-10">
         <ModeToggle />
      </div>

      <div className="hidden md:block absolute top-16 right-5 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-10">
        <p className="text-xs mb-1 font-medium text-center text-gray-700 dark:text-gray-300">Scan Mon Profil</p>
        <QRCode value={vercelUrl} size={80} level="H" /> 
      </div>
      
      {/* ⬅️ CONTENU CENTRAL */}
      <div className="w-full max-w-md space-y-8 text-center">
        
        {/* EN-TÊTE DE PROFIL ET LIENS */}
        <Card className="p-8 shadow-2xl">
          {/* Remplacer par votre contenu de profil */}
          <h1 className="text-3xl font-extrabold mb-1">Votre Nom</h1>
          <p className="text-md text-gray-500 dark:text-gray-400 mb-6">Développeur Full Stack | Next.js & React</p>
          
          <div className="space-y-4">
              {links.map((link) => (
                  <Button key={link.name} asChild className="w-full h-12 justify-start pl-8 pr-8">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          {link.icon}
                          <span className="ml-4 flex-grow text-center pr-8">{link.name}</span>
                      </a>
                  </Button>
              ))}
          </div>
        </Card>


        {/* SECTION REPOS GITHUB */}
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
              <p className="text-gray-500 dark:text-gray-500">
                Chargement des repos ou GITHUB_USERNAME non défini.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}