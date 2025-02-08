/* [grial-metadata] id: Grial#NewsTopicsViewModel.cs version: 1.0.1 */
using System;
using System.Collections.ObjectModel;

namespace FitnessApp
{
    public class TopicsViewModel : ObservableObject
    {
        public TopicsViewModel()
        {
            LoadData();

            TopicTappedCommand = new Command<NewsTopicData>(GoToTopic);
        }

        public Command TopicTappedCommand { get; }
        
        public ObservableCollection<NewsTopicData> Topics { get; } = new ObservableCollection<NewsTopicData>();

        private void GoToTopic(NewsTopicData topic)
        {
            Application.Current.MainPage.DisplayAlert("Topic Tap", $"Topic '{topic.SectionTitle}' has been tapped.", "Ok");
        }

        private void LoadData()
        {
            Topics.Clear();

            JsonHelper.Instance.LoadViewModel(this, source: "News.json", pageName: "NewsTopicsPage.xaml");
        }
    }
}