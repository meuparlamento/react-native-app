import React from 'react';
import { View, Text, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { material, iOSColors } from 'react-native-typography';
import RF from 'react-native-responsive-fontsize';

export default class VotesCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: this.props.cards || [],
    };
  }

  openURL = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  _renderItem = ({ item, index }) => {
    const openPDF = pdfLink => {
      this.openURL(pdfLink);
    };

    const votesMatcher = card => {
      const sameVotes = Object.keys(card.votes)
        .filter(key => card.votes[key] === card.userVote)
        .join(' | ');
      if (sameVotes) {
        switch (card.userVote) {
          case -1:
            return (
              <React.Fragment>
                <Text style={[material.headlineWhite, styles.materialCardDetailsWhite]}>
                  Também reprovaram
                </Text>
                <Text
                  style={[
                    material.headlineWhite,
                    styles.materialCardDetailsWhite,
                    styles.votesMatcherParties,
                  ]}
                >
                  {sameVotes.replace('_', '-')}
                </Text>
              </React.Fragment>
            );
          case 0:
            return (
              <React.Fragment>
                <Text style={[material.headlineWhite, styles.materialCardDetailsWhite]}>
                  Também se abstiveram
                </Text>
                <Text
                  style={[
                    material.headlineWhite,
                    styles.materialCardDetailsWhite,
                    styles.votesMatcherParties,
                  ]}
                >
                  {sameVotes.replace('_', '-')}
                </Text>
              </React.Fragment>
            );
          case 1:
            return (
              <React.Fragment>
                <Text style={[material.headlineWhite, styles.materialCardDetailsWhite]}>
                  Também aprovaram
                </Text>
                <Text
                  style={[
                    material.headlineWhite,
                    styles.materialCardDetailsWhite,
                    styles.votesMatcherParties,
                  ]}
                >
                  {sameVotes.replace('_', '-')}
                </Text>
              </React.Fragment>
            );
        }
      }
      return (
        <Text style={[material.headlineWhite, styles.materialCardDetailsWhite]}>
          Nenhum partido votou como tu
        </Text>
      );
    };

    const truncateString = (text, length) => {
      const textArr = text.split(' ');
      const trimmedString =
        textArr.length > length ? `${textArr.slice(0, length).join(' ')} ...` : text;
      return this.props.screenHeight < 400 ? trimmedString : text;
    };

    return (
      <View
        style={{
          ...styles.card,
          backgroundColor:
            item.userVote === 0 ? '#dbc883' : item.userVote === 1 ? '#89d5c5' : '#db8396',
        }}
      >
        <Text style={[material.titleWhite, styles.materialCardTitleWhite]}>
          {truncateString(item.text, 20)}
        </Text>
        <View style={styles.textContainer}>
          <Text
            style={[
              material.headlineWhite,
              styles.materialCardDetailsWhite,
              { justifyContent: 'flex-end' },
            ]}
          >
            Autoria do {item.proposedBy}
          </Text>
          <Text
            style={[
              material.headlineWhite,
              styles.materialCardDetailsWhite,
              { justifyContent: 'flex-end' },
            ]}
          >
            Votado em {item.voteDate.split('-')[0]}
          </Text>
          <View style={styles.votesMatcher}>{votesMatcher(item)}</View>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={() => this.openNews(item.id, item.voteDate)}>
            <Text style={styles.btnText}>NOTÍCIAS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.openAuthors(item.id)}>
            <Text style={styles.btnText}>AUTORES</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPDF(item.LinkPdf)}>
            <Text style={styles.btnText}>PROPOSTA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  openNews(proposalId, proposalDate) {
    this.props.navigation.navigate('News', {
      proposalId,
      proposalDate,
    });
  }

  openAuthors(proposalId) {
    this.props.navigation.navigate('Authors', {
      proposalId,
    });
  }

  render() {
    return (
      <Carousel
        layout="default"
        ref={c => {
          this._carousel = c;
        }}
        data={this.state.cards}
        renderItem={this._renderItem}
        sliderWidth={this.props.screenWidth}
        itemWidth={this.props.screenWidth * 0.8}
      />
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#8096f6',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    marginVertical: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: RF(2),
    fontFamily: 'AirbnbCerealApp-Bold',
  },
  textContainer: {
    flex: 0.6,
    justifyContent: 'space-around',
    marginVertical: RF(2),
  },
  votesMatcher: {
    marginVertical: RF(1),
  },
  btnContainer: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  materialCardTitleWhite: {
    color: iOSColors.white,
    fontSize: RF(2.6),
    lineHeight: RF(2.6),
    fontFamily: 'AirbnbCerealApp-Medium',
  },

  materialCardDetailsWhite: {
    color: iOSColors.white,
    fontSize: RF(2),
    lineHeight: RF(2.2),
    fontFamily: 'AirbnbCerealApp-Medium',
  },

  votesMatcherParties: {
    fontFamily: 'AirbnbCerealApp-Bold',
  },
});
