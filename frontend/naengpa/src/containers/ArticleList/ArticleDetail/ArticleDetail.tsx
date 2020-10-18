import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';


interface Props {

} // or type Props = {}

interface State {

} // or type State = {}

class ArticleDetail extends React.Component<Props, State> {
  render() {
    return (
      <div>Article Detail</div>
    ) 
  }
}

// const mapStateToProps = (state: ArticleState) => ({
//   articleList: state.article.list,
// });
// const StatePropsTypes = returntypeof(mapStateToProps);

// const mapDispatchToProps = (dispatch: Dispatch<{ }>) => 
//   bindActionCreators(
//     {
//       getArticle: articleActions.getArticle,
//     }, 
//     dispatch
//   );

// const actionPropsTypes = returntypeof(mapDispatchToProps)

export default ArticleDetail;