
// import { useStaticQuery, graphql } from 'gatsby';

const Projects = () => {
//   const data = useStaticQuery(graphql`
//     query {
//       projects: allMarkdownRemark(
//         filter: {
//           fileAbsolutePath: { regex: "/content/projects/" }
//           frontmatter: { showInProjects: { ne: false } }
//         }
//         sort: { fields: [frontmatter___date], order: DESC }
//       ) {
//         edges {
//           node {
//             frontmatter {
//               title
//               tech
//               github
//               external
//             }
//             html
//           }
//         }
//       }
//     }
//   `);

//   const [showMore, setShowMore] = useState(false);
//   const revealTitle = useRef(null);
//   const revealArchiveLink = useRef(null);
//   const revealProjects = useRef([]);
//   const prefersReducedMotion = usePrefersReducedMotion();

//   useEffect(() => {
//     if (prefersReducedMotion) {
//       return;
//     }

//     sr.reveal(revealTitle.current, srConfig());
//     sr.reveal(revealArchiveLink.current, srConfig());
//     revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
//   }, []);

//   const GRID_LIMIT = 6;
//   const projects = data.projects.edges.filter(({ node }) => node);
//   const firstSix = projects.slice(0, GRID_LIMIT);
  
  return null;
};

export default Projects;
