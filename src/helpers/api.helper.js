import { Animated } from 'react-native';
const config = require('../../config.json');

const fetchCardData = async (url) => {
    try {
      const headers = new Headers();
      headers.append('Accept', 'application/json');
  
      const response = await fetch(url, { 
          method: 'GET',
          headers: headers,
          mode: 'cors',
          cache: 'default' 
        });  
      const json = await response.json();
      return json.data;
    } catch (error) {
      throw error;
    }
  }

export const getCardsContent = async (quantity, recentProposals = false) => {
  console.log('helper', quantity);
  console.log('recentProposals-API ------------------>', recentProposals);
  const proposalsUrl = config.api.proposals.batch.url;
  const recentUrl = config.api.proposals.recent.url;
  let cards = [];
  let lastItemPosition = false;
  try {
    // fetch proposals
    const data = recentProposals ? await fetchCardData(`${proposalsUrl}/${quantity}`) : await fetchCardData(`${recentUrl}/${quantity}`);
    cards = data.map(row => {
      const position = new Animated.ValueXY();
      const { BE, CDS_PP, PCP, PEV, PS, PSD, PAN } = row;
      console.log(row);
      const card = {
        position,
        parentPosition: lastItemPosition,
        id: row.IDProposal,
        text: row.Description,
        summary: row.Summary,
        voteDate: row.VoteDate,
        LinkPdf: row.LinkPdf,
        isActive: false,
        proposalDetails: false,
        votes: { BE, CDS_PP, PCP, PEV, PS, PSD, PAN },
        proposedBy: row.ProposedBy,
        result: row.Result,
        userVote: null,
      };
      lastItemPosition = position;
      return card;
    });
    cards[0].isActive = true;
    return cards;
  } catch (error) {
    console.log(error);
    throw error;
  }
};