/* [grial-metadata] id: Grial#NewsSourceProfileViewModel.cs version: 1.0.1 */
using System;
using System.Collections.ObjectModel;

namespace FitnessApp
{
	public class SourceProfileViewModel : ObservableObject
	{
        private NewsProfileData _profileData;
        private bool _isFollowing;

        public SourceProfileViewModel()
		{
            LoadData();

            ToggleFavoriteCommand = new Command<NewsArticleData>((a) => a.IsFavorite = !a.IsFavorite);
            ToggleFollowCommand = new Command(() => IsFollowing = !IsFollowing);
        }

        public Command ToggleFavoriteCommand { get; set; }
        public Command ToggleFollowCommand { get; set; }

        public ObservableCollection<NewsArticleData> List { get; } = new ObservableCollection<NewsArticleData>();

        public NewsProfileData ProfileData 
        { 
            get => _profileData;
            set => SetProperty(ref _profileData, value);
        }

        public bool IsFollowing
        {
            get => _isFollowing;
            set => SetProperty(ref _isFollowing, value);
        }

        private void LoadData()
        {
            List.Clear();

            JsonHelper.Instance.LoadViewModel(this, source: "News.json", pageName: "NewsSourceProfilePage.xaml");
        }
    }
}

