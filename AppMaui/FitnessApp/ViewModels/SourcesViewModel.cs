/* [grial-metadata] id: Grial#NewsSourcesViewModel.cs version: 1.0.1 */
using System;
using System.Collections.ObjectModel;

namespace FitnessApp
{
	public class SourcesViewModel : ObservableObject
	{
        private readonly INavigation _navigation;

        public SourcesViewModel(INavigation navigation)
        {
            _navigation = navigation;
            LoadData();

            ToggleFollowCommand = new Command<NewsSourcesData>((s) => s.IsFollowing = !s.IsFollowing);
            SourceTappedCommand = new Command<NewsSourcesData>(GoToSource);
        }

        public Command ToggleFollowCommand { get; }
        public Command SourceTappedCommand { get; }

        public ObservableCollection<NewsSourcesData> Sources { get; } = new ObservableCollection<NewsSourcesData>();

        private void GoToSource(NewsSourcesData source)
        {
            if (source.Name == "The New Worker")
            {

            }
            else
            {
                Application.Current.MainPage.DisplayAlert("Source Tapped", "Pick source 'The New Worker' to see details", "Ok");
            }
        }

        private void LoadData()
        {
            Sources.Clear();

            JsonHelper.Instance.LoadViewModel(this, source: "News.json", pageName: "NewsSourcesPage.xaml");
        }
    }
}