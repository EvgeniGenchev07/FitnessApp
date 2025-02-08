/* [grial-metadata] id: Grial#NewsDetailViewModel.cs version: 1.0.1 */
using System.Collections.ObjectModel;

namespace FitnessApp
{
	public class DetailViewModel : ObservableObject
	{
		public DetailViewModel(NewsArticleData selectedArticle = null)
		{
            LoadData();

            SelectedArticle = selectedArticle ?? List.FirstOrDefault();

            if (SelectedArticle != null)
            {
                ArticleSource = Sources.FirstOrDefault(s => s.Name.Equals(SelectedArticle.SourceId));
            }

            ToggleFavoriteCommand = new Command<NewsArticleData>((a) => a.IsFavorite = !a.IsFavorite);
            ToggleFollowCommand = new Command(ToggleFollow, canExecute: () => ArticleSource != null);
        }

        public Command ToggleFavoriteCommand { get; set; }
        public Command ToggleFollowCommand { get; }

        public NewsArticleData SelectedArticle { get; }
        public NewsSourcesData ArticleSource { get; }

        public ObservableCollection<NewsArticleData> List { get; } = new ObservableCollection<NewsArticleData>();
        public ObservableCollection<NewsSourcesData> Sources { get; } = new ObservableCollection<NewsSourcesData>();
        public ObservableCollection<NewsArticleData> Related { get; } = new ObservableCollection<NewsArticleData>();

        private void ToggleFollow()
        {
            ArticleSource.IsFollowing = !ArticleSource.IsFollowing;
        }

        private void LoadData()
        {
            List.Clear();
            Sources.Clear();
            Related.Clear();

            JsonHelper.Instance.LoadViewModel(this, source: "News.json", pageName: "NewsDetailPage.xaml");
            
            // Simulate related
            foreach (var item in List.Take(new Range(5, 8)))
            {
                Related.Add(item);
            } 
        }
    }
}

