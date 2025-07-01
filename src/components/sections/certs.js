import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledCertsSection = styled.section`
  max-width: 1000px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;
  border-left: 2px solid var(--lightest-navy);

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
    text-align: center;
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

// Updated TabPanel with better cert wrapping
const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xl);
    font-weight: 500;
    display: flex;
    flex-wrap: nowrap;
    line-height: 1;
    align-items: center;

    .company {
      margin-top: -10px;
      margin-bottom: 15px;
      color: var(--green);

      a {
        ${({ theme }) => theme.mixins.inlineLink};
      }
    }
  }

  .dates {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
  
  .status {
    display: inline-block;
    padding: 0.35em 0.65em;
    font-size: var(--fz-xxs);
    font-weight: 500;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    border-radius: var(--border-radius);
    margin-left: 10px;
    
    &.active {
      background-color: var(--green-tint);
      color: var(--green);
    }
    
    &.expired {
      background-color: var(--red-tint);
      color: var(--red);
    }
  }
  
  .validation {
    margin-top: 10px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    
    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

// Styled component for the wrapping grid container
const CertsGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.manyItems ? 'repeat(2, 1fr)' : '1fr'};
  gap: 25px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Styled component for each certification item
const CertItem = styled.div`
  width: 100%;
  background-color: var(--light-navy);
  border-radius: var(--border-radius);
  padding: 20px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

// This is a new styled component to fix the header alignment
const CertTitle = styled.div`
  display: flex;
  align-items: center;
  
  /* Make sure very long certification titles don't break layout */
  overflow: hidden;
  
  /* The title itself should be truncated if needed */
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Certs = () => {
  const data = useStaticQuery(graphql`
    query {
      certs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/certs/" } }
        sort: { fields: [frontmatter___companyRank, frontmatter___certRank], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              certRank
              company
              issueDate
              expiryDate
              url
              show
            }
            html
          }
        }
      }
    }
  `);

  const certsData = data.certs.edges;

  // Group certifications by company so that each company has one tab.
  const groupedCerts = certsData.reduce((acc, { node }) => {
    const { company } = node.frontmatter;
    if (!acc[company] && node.frontmatter.show != false) {
      acc[company] = [];
    }
    if (node.frontmatter.show != false) {
      acc[company].push(node);
    }
    return acc;
  }, {});

  // Get the unique companies
  const companies = Object.keys(groupedCerts);

  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, [prefersReducedMotion]);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  useEffect(() => focusTab(), [tabFocus]);

  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP:
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      case KEY_CODES.ARROW_DOWN:
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      default:
        break;
    }
  };

  // Helper to determine if a certificate is active or expired
  const isCertActive = expiryDate => {
    if (!expiryDate) return true;
    const now = new Date();
    const expiry = new Date(expiryDate);
    return now < expiry;
  };

  // Format dates for display
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Check if a company has more than 9 certs to enable wrapping
  const hasManyItems = company => {
    return groupedCerts[company] && groupedCerts[company].length > 9;
  };

  return (
    <StyledCertsSection id="certs" ref={revealContainer}>
      <h2 className="numbered-heading">My Professional Certifications</h2>
      <div className="inner">
        <StyledTabList role="tablist" aria-label="Certification tabs" onKeyDown={onKeyDown}>
          {companies.map((company, i) => (
            <StyledTabButton
              key={company}
              isActive={activeTabId === i}
              onClick={() => setActiveTabId(i)}
              ref={el => (tabs.current[i] = el)}
              id={`tab-${i}`}
              role="tab"
              tabIndex={activeTabId === i ? '0' : '-1'}
              aria-selected={activeTabId === i}
              aria-controls={`panel-${i}`}>
              <span>{company}</span>
            </StyledTabButton>
          ))}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {companies.map((company, i) => (
            <CSSTransition key={company} in={activeTabId === i} timeout={250} classNames="fade">
              <StyledTabPanel
                id={`panel-${i}`}
                role="tabpanel"
                tabIndex={activeTabId === i ? '0' : '-1'}
                aria-labelledby={`tab-${i}`}
                aria-hidden={activeTabId !== i}
                hidden={activeTabId !== i}>
                
                {/* Use the CertsGrid component with dynamic manyItems prop */}
                <CertsGrid manyItems={hasManyItems(company)}>
                  {/* Render all certificates for this company */}
                  {groupedCerts[company].map((cert, j) => {
                    const { frontmatter, html } = cert;
                    const { title, url, issueDate, expiryDate } = frontmatter;
                    const isActive = isCertActive(expiryDate);
                    return (
                      <CertItem key={j}>
                        <h3>
                          <CertTitle>
                            <a href={url} className="inline-link">
                              <span>{title}</span>
                            </a>
                            <span className={`status ${isActive ? 'active' : 'expired'}`}>
                              {isActive ? 'Active' : 'Expired'}
                            </span>
                          </CertTitle>
                        </h3>
                        <p className="dates">
                          {formatDate(issueDate)}
                          {expiryDate ? ` - ${formatDate(expiryDate)}` : ' (No Expiration)'}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                      </CertItem>
                    );
                  })}
                </CertsGrid>
              </StyledTabPanel>
            </CSSTransition>
          ))}
        </StyledTabPanels>
      </div>
    </StyledCertsSection>
  );
};

export default Certs;